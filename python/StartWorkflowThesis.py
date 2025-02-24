print('Content-Type: text/plain')
print('')
import sys
import shutil

def copy_and_rename(src_path, dest_path, new_name):
	# Rename the copied file
	new_path = f"{dest_path}/{new_name}"
	shutil.copyfile(src_path, new_path)
    
print("Number of arguments= ", len(sys.argv))

source_file = "C:\\ScarpatiHomeSite\\Thesis-PW\\repo\\ToSend.pdf"
destination_folder = "C:\\WatchFolder\\Thesis - Luca"
new_file_name = sys.argv[1] + ".pdf"

copy_and_rename(source_file, destination_folder, new_file_name)
print("Start workflow and after AI interaction send email to: " + sys.argv[1])