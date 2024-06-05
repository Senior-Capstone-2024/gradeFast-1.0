"""
Call with "python3 report_generator/main.py path/to/json"
"""

from dotenv import load_dotenv
from pylatex import Document, Section, NewPage
from pylatex.utils import NoEscape
import os
from os import path
import sys
import json

from util.parse_json import json_to_dict

error_links = {
    'Improper Capitalized Primitive Type': 'https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html',
    'Improper Method Name': 'https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html',
    'Too many statements on this line, revise': 'https://www.oracle.com/java/technologies/javase/codeconventions-declarations.html',
    'Improper Class Or Interface': 'https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html'
}

def format_doc():
    geometry_options = {
        'margin': '0.5in'
    }
    
    doc = Document(geometry_options=geometry_options)
    doc.change_document_style('empty')
    return doc

def assemble_pdf(json_file_path: str):
    with open(json_file_path, 'r') as f:
        data = json.load(f)
    
    # load path to pdflatex
    dotenv_path = path.join(path.dirname(__file__), '.env')
    load_dotenv(dotenv_path)
    PDFLATEX_PATH = os.environ.get('PDFLATEX_PATH')
    
    doc = format_doc()
    
    keys = list(data.keys())
    with doc.create(Section(NoEscape(r'\centerline{' "Student A" + '}'), numbering=False)):
        doc.append(NoEscape(r'\centerline{/src/file.java} \n'))  
        doc.append('\n')
        doc.append('\n\n')
        
        for key in keys:
            doc.append(NoEscape(f"Line: {key}"))
            doc.append('\n')
            if data[key] is not None:
                values = data[key]
                values = [str(value).strip("'") for value in values]
                error_type = "Error Type: " + ", ".join(values)
                doc.append(NoEscape(error_type))
                doc.append('\n')
            else:
                doc.append(NoEscape("Error Type:"))
                doc.append('\n')
            
            doc.append(NoEscape("Description:"))
            doc.append('\n')
            doc.append(NoEscape("Additional Notes:"))
            doc.append('\n')
            doc.append('\n')

    doc.append(NewPage())
    doc.append(Section(NoEscape(r'\underline{Additional Resources:}'), numbering=False))
    doc.append('\n')
    doc.append('\n')

    added_errors = set()

    for key in keys:
        if data[key] is not None:
            values = data[key]
            unique_values = list(set([str(value).strip("'") for value in values]))  # Removes duplicates
            for error_name in unique_values:
                error_message = error_name 
                if error_message not in added_errors:  
                    if error_name in error_links:
                        link = error_links[error_name]
                        doc.append(NoEscape(error_message + r': \underline{\href{' + link + r'}{link}}\n'))
                        doc.append('\n')
                    else:
                        doc.append('- ' + error_message + '\n')
                    added_errors.add(error_message)
        else:
            doc.append("\n") 
  
    doc.generate_pdf('report_out/report_out', clean_tex=False, compiler=PDFLATEX_PATH)

if __name__ == '__main__':
    assemble_pdf(sys.argv[1])
