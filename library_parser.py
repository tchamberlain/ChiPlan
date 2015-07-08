import csv
spamWriter = csv.writer(open('library_events.csv', 'wb'))


# libary parser
#  notes: deleted         <title>All CPL Locations Closed Monday, September 7</title>
# to make program run


#start teens at zero, since we don't want it to print to the csv until we find the teen tag
teens=0
line_num=0
fh = open('library_all_events.txt')

# make the header line
spamWriter.writerow(["title","start_date_f","end_date_f","lat","lng","address","description","tags","source"])

for line in fh.readlines():
    if (line.find("&#39;") != -1):
      line=line.replace("&#39;","'")
    if (line.find("<title>") != -1):
        title= (line.split("<title>"))[1].split("</title>")[0]
    elif (line.find("<bc:start_date>") != -1):
        start_date_f=(line.split("<bc:start_date>"))[1].split("</bc:start_date>")[0]
    elif (line.find("<bc:end_date>") != -1):
        end_date_f= (line.split("<bc:end_date>"))[1].split("</bc:end_date>")[0]
    elif (line.find("<bc:latitude>") != -1):
        lat=(line.split("<bc:latitude>"))[1].split("</bc:latitude>")[0]
        lng=(line.split("<bc:longitude>"))[1].split("</bc:longitude>")[0]
        number=(line.split("<bc:number>"))[1].split("</bc:number>")[0]
        street=(line.split("<bc:street>"))[1].split("</bc:street>")[0]
        city=(line.split("<bc:city>"))[1].split("</bc:city>")[0]
        zipcode=(line.split("<bc:zip>"))[1].split("</bc:zip>")[0]
        state=(line.split("<bc:state>"))[1].split("</bc:state>")[0]
        address=number+" "+street+", "+city+", "+state+" "+zipcode
    elif (line.find("<description><![CDATA[<p>") != -1): 
        description=(line.split("<description><![CDATA[<p>"))[1].split("</p>")[0]
        description=description.split("<br>")[0]
        description=description.split("<span>")[0]
        description=description.split("<b>")[0]
    elif (line.find(">Teens</category>") != -1): 
        teens=1
    
    ##### get tags ##############
    elif (line.find("Art, Movies and Performances") != -1): 
        tags= "art/entertainment"
    elif (line.find("Jobs and Careers") != -1): 
        tags= "art"
    elif (line.find("DIY") != -1): 
        tags= "art"
    elif (line.find("Crafts, Games and Play") != -1): 
        tags= "art/entertainment"
    elif (line.find("Computers and Technology") != -1): 
        tags= "entertainment"
    ##### end of tags #################

    elif (line.find("</item>") != -1): 
        if teens==1:

            # string_to_write= title+","+start_date_f+","+end_date_f+","+lat+","+lng+","+address+","+description+","+tags+"\n"
            # write_file.write(string_to_write)
            source="library"

            spamWriter.writerow([title,start_date_f,end_date_f,lat,lng,address,description,tags,source])
            teens=0



