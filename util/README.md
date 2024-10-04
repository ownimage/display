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

# get Quotes

Get quotes with `curl https://zenquotes.io/api/quotes > q.json`
Tidy them up with `jq '.' q.json  > quotes.json`
Copy them to the src folder

## Versions
Python 3.10.6

