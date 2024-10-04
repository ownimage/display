"""
This script interrogates the images directory.
It renames any files to remove spaces.
It then creates the gallery.json with a list of all the files in the directory
"""

import json
import os
import stat
from urllib.parse import quote

import paramiko
from paramiko.sftp_attr import SFTPAttributes

test_gallery_path = "../display/src/images/test"
content_json_path = '../display/src/gallery.json'

user = os.environ.get('FTP_USER')
password = os.environ.get('FTP_PASSWORD')
server = os.environ.get('FTP_SERVER')

print(f'images_path={test_gallery_path}')
print(f'content_json_path={content_json_path}')
print(f'user={user}')
print(f'password={password}')
print(f'server={server}')


class FileInfo:
    def __init__(self, file: SFTPAttributes):
        self.name = file.filename
        self.is_dir = stat.S_ISDIR(file.st_mode)
        self.is_link = stat.S_ISLNK(file.st_mode)
        self.is_file = stat.S_ISREG(file.st_mode)
        self.size = file.st_size
        self.modified_on = file.st_mtime


with open(content_json_path, 'r') as file:
    content = json.load(file)

content['galleries'] = {}
content['galleries']['test'] = []

with os.scandir(test_gallery_path) as entries:
    for entry in entries:
        if entry.is_file():
            new_name = entry.name.replace(' ', '')
            if new_name != entry.name:
                os.rename(os.path.join(test_gallery_path, entry.name),
                          os.path.join(test_gallery_path, new_name))
            content['galleries']['test'].append(new_name)

# add the contents of the galleries from the ftp site
try:

    # Create an SSH client
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    # Connect to the server
    ssh.connect(server, username=user, password=password)

    # Create an SFTP session
    sftp = ssh.open_sftp()

    # # Change to the desired directory
    sftp.chdir('/images')
    #
    # # List the contents of the directory
    directory_contents = sftp.listdir_attr()
    #
    # # Print the contents
    for dir in directory_contents:
        di = FileInfo(dir)
        if di.is_dir:
            content['galleries'][di.name] = []
            sftp.chdir(f'/images/{di.name}')
            files = sftp.listdir_attr()
            for file in files:
                fi = FileInfo(file)
                if fi.is_file:
                    content['galleries'][di.name].append(quote(fi.name))

except Exception as e:
    print(e)
finally:
    # Close the SFTP session and SSH connection
    sftp.close()
    ssh.close()

with open(content_json_path, 'w') as json_file:
    json.dump(content, json_file, indent=4)
