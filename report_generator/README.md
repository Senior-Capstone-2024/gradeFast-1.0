# SETUP

1. Download a LaTeX distribution such as MiKTeX. MacTeX is available for Macs but is ~9GB after installation.
2. Find the path to your pdflatex executable/binary. Make a note of where it is.
3. Open the GradeFast repo in VSCode.
4. Create report_generator/.env and add the following to it:
'''
PDFLATEX_PATH="path/to/your/pdflatex"
'''
where path/to/your/pdflatex is the path you found earlier.
5. Run the following commands in your VSCode terminal. If VSCode shows a pop-up asking about switching to a python environment, click yes.
'''
python3 -m venv venv
source venv/bin/activate
pip install python-dotenv pylatex
'''
6. You should be set up now. Ideally the script should be run from inside the OUTER report_generator folder like so:
'''
python3 report_generator/main.py assemble_pdf path/to/json/file
'''
If you are using the example json in the report_generator folder and your working directory is also gradefast/report_generator, path/to/json/file would simply be "example.json".
