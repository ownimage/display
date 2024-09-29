# General 

## Overview

The display uses galleries to group images.  Each gallery is uploaded as a directory of images to the ftp server byindependent means, (e.g. Filzilla, webspace upload).
## Running scripts

The scripts in this directory are designed to be run from Windows

Uses environment variables FTP_SERVER, FTP_USER and FTP_PASSWORD for the credentials.

## deploy 
`python deploy.py`

This will copy the contents of the `display\src` directory to the ftp server.

# generate
`python generate.py`

This will take the copy of `content.json` from the `display\src` directory, and update the `galleries` section with the gallery information that is on the ftp server.

## Versions
Python 3.10.6

