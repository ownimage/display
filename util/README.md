# General 

## Overview
The application is primarily JS.  It does use JSX and some of the later features so does need to 
be transpiled using babel.

The deployment uses python 3.10.6 and there is a `requirements.txt` file.  These instructions assume a 
virtual environment `venv` has been set up.

There is also a php file in the Galleries app that generates the list of all of the galleries and
images that are available.

## Building
The app is built using `util/build.sh` which copies the source from the `display\src` directory 
to the `dist`` directory and overlays the `display\config` directory (which is not checked into git),
then finally runs babel on the `display\src` and overlays the results into `dist`.

## Deploying

The scripts in this directory are designed to be run from wsl.

To set up the python environment `source venv/bin/activate`

Then in the `util` direcotry `source set_creds.sh` to set the environment variables 
FTP_SERVER, FTP_USER and FTP_PASSWORD for the credentials.

Then to deploy everything `python deploy.py`.

To only deploy changes since last commit `python deploy-changed.py`.

## Development
Open `dist\index.html` from the intellij link to chrome.

Make changes.

From `utils` run `./build.sh` and retest.

# App specific infomation

## Gallery
The display uses galleries to group images.  Each gallery is uploaded as a directory of images to the ftp server 
by independent means, (e.g. Filzilla, webspace upload).

## Quotes

Get quotes with `curl https://zenquotes.io/api/quotes > q.json`

Tidy them up with `jq '.' q.json  > quotes.json`

Copy them to the src folder



