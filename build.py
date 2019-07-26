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

def get_source_files(source_list):
    _dir_source = ""
    for item in source_list:
        _dir_source = _dir_source  + joiner(item) + " "

    return _dir_source

#--------------------------------------------------------------#

class Create:
    def __init__(self, source_list, filename = 'index' ):
        self.output_dir = joiner("dist/")
        self.get_list = source_list
        self.filename = filename

    def html(self):
        command = 'pandoc --standalone --title-prefix="Josh Martin" --from markdown --to html -o '
        output_file = joiner( self.filename + ".html ", self.output_dir)
        self.__run_command(command + output_file + self.get_list)

    def pdf(self):
        command = 'wkhtmltopdf '
        input_file = joiner( self.filename + '.html' ,self.output_dir, True)
        output_file = joiner( self.filename + '.pdf',self.output_dir)

        self.__run_command(command + input_file + output_file)

    def text(self):
        command ='pandoc --standalone  --from markdown+smart --to plain -o ' 
        input_files = self.get_list 
        output_file = joiner( self.filename + '.txt', self.output_dir, True)

        self.__run_command(command + output_file + input_files)

    def all(self):
        self.html()
        self.pdf()
        self.text()

    def __run_command(self, command):
        print("==> {}\n".format(command))
        _output = os.system(command)
        error_code = int(_output)
        assert (error_code != 256), 'File doesn\'t exist'

#--------------------------------------------------------------#
class Resumes:
    def __init__(self):
        self._embedded = None
        self._web_dev = None
        self._general = None
        self._funs = [self.embedded, self.web_dev]

    def embedded(self):
        if self._embedded is not None:
            return self._embedded, 'embedded'

        source_list = [
                'src/_common/header.md', 
                'src/embedded/education.md',
                'src/embedded/experience_embedded.md', 
                'src/selected-projects_general.md',
                'src/embedded/sidebar_embedded.md'
                ]
        self._embedded = get_source_files(source_list)
        return self._embedded, 'embedded'

    def web_dev(self):
        if self._web_dev is not None:
            return self._web_dev, 'index'
        source_list = [
                'src/_common/header.md', 
                'src/education.md',
                'src/web_dev/experience_general.md', 
                'src/selected-projects_general.md',
                'src/_common/sidebar_general.md'
                ]
        self._web_dev = get_source_files(source_list)
        return self._web_dev, 'index'

    # def general(self):
        # if self._general is not None:
            # return self._general

        # source_list = [
                # 'src/_common/header.md', 
                # 'src/embedded/education.md',
                # 'src/embedded/experience_embedded.md', 
                # 'src/selected-projects_general.md',
                # 'src/embedded/sidebar_embedded.md'
                # ]
        # self._general = get_source_files(source_list)
        # return self._general

    def all(self):
        for fun in self._funs:
            source_list, file_name = fun()
            Create(source_list, file_name).all()

    def pdf(self):
        for fun in self._funs:
            source_list, file_name = fun()
            Create(source_list, file_name).pdf()

    def html(self):
        for fun in self._funs:
            source_list, file_name = fun()
            Create(source_list, file_name).html()

    def text(self):
        for fun in self._funs:
            source_list, file_name = fun()
            Create(source_list, file_name).text()

#--------------------------------------------------------------#

paser = argparse.ArgumentParser()   

paser.add_argument('--html', action="store_true")
paser.add_argument('--pdf', action="store_true")
paser.add_argument('--text', action="store_true")
paser.add_argument('--name') # TODO

args = paser .parse_args()

resumes = Resumes()

if args is None:
    resumes.all()
else:
    if args.html:
        resumes.html()
    if args.pdf:
        resumes.pdf()
    if args.text:
        resumes.text()


