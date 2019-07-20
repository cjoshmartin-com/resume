#! /usr/bin/python

#--------------------------------------------------------------#

import argparse
import os 

#--------------------------------------------------------------#

# Constants
folder_path = os.path.dirname(os.path.abspath(__file__)) + "/" 

# Variables


# Helpers
def joiner(files_path, base_path=folder_path, should_add_padding=False):
    _location = base_path + files_path
    if should_add_padding:
        _location = _location + " "
    return _location 

def get_source_files():
    _source_list = ['header.md', 'experience_general.md', 'selected-projects_general.md', 'sidebar_general.md' ]
    _dir_source = ""
    for item in _source_list:
        _dir_source = _dir_source  + joiner('src/' + item) + " "

    return _dir_source

#--------------------------------------------------------------#

class Create:
    def __init__(self):
        self.output_dir = joiner("dist/")
        self.get_sourced = get_source_files()

    def html(self):
        command = 'pandoc --standalone --title-prefix="Josh Martin" --from markdown --to html -o '
        output_file = joiner("index.html ", self.output_dir)
        self.__run_command(command + output_file + self.get_sourced)

    def pdf(self):
        command = 'wkhtmltopdf '
        input_file = joiner('index.html' ,self.output_dir, True)
        output_file = joiner('index.pdf',self.output_dir)

        self.__run_command(command + input_file + output_file)

    def text(self):
        command ='pandoc --standalone  --from markdown+smart --to plain -o ' 
        input_files = self.get_sourced 
        output_file = joiner('index.txt', self.output_dir, True)

        self.__run_command(command + output_file + input_files)

    def all(self):
        self.html()
        self.pdf()
        self.text()

    def __run_command(self, command):
        print("==> {}".format(command))
        _output = os.system(command)
        print(_output)

#--------------------------------------------------------------#

create = Create()

#--------------------------------------------------------------#

paser = argparse.ArgumentParser()   

paser.add_argument('--html', action="store_true")
paser.add_argument('--pdf', action="store_true")
paser.add_argument('--text', action="store_true")

args = paser .parse_args()

if args is None:
    create.all()
else:
    if args.html:
        create.html()
    if args.pdf:
        create.pdf()
    if args.text:
        create.text()


