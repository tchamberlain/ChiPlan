import csv
spamWriter = csv.writer(open('night_in_the_park_events.csv', 'wb'))
new_file= open('parks_all_events_with_n.txt', 'wb')

# parks parser

fh = open('parks_all_night_events.txt')


# make the header line
spamWriter.writerow(["title","start_date_f","end_date_f","address","description","source","tags"])


item_num=0
for line in fh.readlines():
    line=line.split("<item>")
    #set start date at zero to rule out if an item is not an event
    start_date_f=0
    # started at second item for teen events, since first two = not events, check if it's two items for future lists
    for item in line:
        item_num+=1
        if (item.find("<title>") != -1):
            title= (item.split("<title>"))[1].split("</title>")[0]
            ## removing "teen " from event titles
            if (title.find("teen") != -1):
                title= title.replace("teen","")
                title= title.replace("Night Out: ","")
            if (title.find("Teen") != -1):
                title= title.replace("Teen","")
                title= title.replace("Night Out: ","")
        if (item.find("<ev:startdate>") != -1):
            start_date_f= (item.split("<ev:startdate>"))[1].split("</ev:startdate>")[0]
        if (item.find("<ev:enddate>") != -1):
            end_date_f= (item.split("<ev:enddate>"))[1].split("</ev:enddate>")[0]
        if (item.find("<ev:location>") != -1):
            address= (item.split("<ev:location>"))[1].split("</ev:location>")[0]
        if(item.find("<description>") != -1):
            description= (item.split("<description>"))[1].split("</description>")[0]
        if(item.find("[CDATA[") != -1):
            description2=(item.split("[CDATA["))[1].split("]>")[0]
            description= description2
        source= "parks"
        #check if item is event, then add it to csv
        if (start_date_f!=0):
            if(title.find("mobile")==-1)and(title.find("family")==-1)and(title.find("Toddler")==-1)and (title.find("Movie")==-1)and(title.find("Family")==-1):
                print title
                spamWriter.writerow([title,start_date_f,end_date_f,address,description,source,"none"])


