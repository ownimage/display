import os
import git
import paramiko

user = os.environ.get('FTP_USER')
password = os.environ.get('FTP_PASSWORD')
server = os.environ.get('FTP_SERVER')
print(f'server={server}\nuser={user}\npassword={password}')

tracked_dir = 'display/src/'
git_path = '../'

repo = git.Repo(git_path)
changed_files = [item.a_path for item in repo.index.diff(None)]

try:
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(server, username=user, password=password)
    sftp = ssh.open_sftp()

    for file_path in changed_files:
        if file_path.startswith(tracked_dir):
            # remove the tracked_dir from the front file_path
            ftp_path = file_path.replace(tracked_dir, '', 1)
            file_path = git_path + file_path
            print(f'Uploaded file: {file_path}')
            sftp.put(file_path, ftp_path)
finally:
    sftp.close()
    ssh.close()