"""
This script interrogates the images directory.
It renames any files to remove spaces.
It then creates the content.json with a list of all the files in the directory
"""

import os
import json

images_path = "./images"
content_json_path = 'content.json'

with open(content_json_path, 'r') as file:
    content = json.load(file)

content['all'] = []

with os.scandir(images_path) as entries:
    for entry in entries:
        if entry.is_file():
            new_name = entry.name.replace(' ', '')
            if new_name != entry.name:
                os.rename(os.path.join(images_path, entry.name),
                          os.path.join(images_path, new_name))
            content['all'].append(new_name)

with open(content_json_path, 'w') as json_file:
    json.dump(content, json_file, indent=4)
