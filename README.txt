Collecting Data
1. Make sure to first turn the server on. The server file is the index.js which is using Express. To run the server “node index.js”.You can keep the server on by using “screen -r” on  a linux os. 
2. You can then run the video recording app on one of the phones while running the controlling car on another phone. When you start recording actual info make sure to run that on the controlling end. This makes sure we don’t get any useless data which would end up corrupting our model.
   1. You can check if you successfully collected the data by going to the server and looking inside the database. 
1. Once you gather the data and video. You need to split the video so that you can get images. This is done by running “python script.py split ./static-content/videos/11:03:19:22:04:54:6550 2500” this splits the video into images ever 1/4 of a sec.
   1. Make sure you are not using the db for anything else like collecting data. The split.py locks the db. 
1. Then to match each label and image together just use “python split.py pair”.
   1. Again make sure you are not using the db for anything else.
1. Repeat steps 1-4 until you feel that you enough data.


Training Model
1. Use the server to get a data.json which then is used for extractFeatures.txt. This creates a features.txt which has each image pixels and the bucket that it should go to.
2. You can then run the classify.py which would duplicate the data set so that each bucket can equally be balance. This allows us to train the model and test it using a training set.
3. You can download a tflite file from classify.py which you can then upload to the phone to use.