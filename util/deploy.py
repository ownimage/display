import os

import paramiko

user = os.environ.get('FTP_USER')
password = os.environ.get('FTP_PASSWORD')
server = os.environ.get('FTP_SERVER')
print(f'server={server}\nuser={user}\npassword={password}')


def put_dir(sftp, source, dest):
    for root, dirs, files in os.walk(source):
        for dir in dirs:
            try:
                sftp.mkdir(os.path.join(dest, ''.join(root.rsplit(source))[1:], dir))
            except:
                pass
        for file in files:
            sftp.put(os.path.join(root, file), os.path.join(dest, ''.join(root.rsplit(source))[1:], file))


try:

    # Create an SSH client
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Connect to the server
    ssh.connect(server, username=user, password=password)

    # Create an SFTP session
    sftp = ssh.open_sftp()

    # # Change to the desired directory
    # # sftp.chdir('/path/to/directory')
    #
    # # List the contents of the directory
    # directory_contents = sftp.listdir()
    #
    # # Print the contents
    # for item in directory_contents:
    #     print(item)

    put_dir(sftp, '../display/src', '/')

except:
    # Close the SFTP session and SSH connection
    sftp.close()
    ssh.close()
