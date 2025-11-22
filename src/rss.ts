import { XMLParser } from "fast-xml-parser";
import { Agent } from "http";

type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    items: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string):Promise<RSSFeed>{
    const feed = await fetch(feedURL,{headers:{"User-Agent":"gator"}});

    if(!feed.ok){
        throw new Error(`Problem getting the data at ${feedURL}`);
    }

    const feedText = await feed.text();
    const parser = new XMLParser();
    const jscriptObj = parser.parse(feedText);
    
    if(!jscriptObj.rss.channel){
        throw new Error("Channel field doesn't exist");
    }
    const channelField = jscriptObj.rss.channel;

    if(!(channelField.title && channelField.link && channelField.description)){
        throw new Error("Channel field is partially missing");
    }

    const channelTitle = channelField.title;
    const channelLink = channelField.link;
    const channelDescription = channelField.description;
    const rawItems = Array.isArray(channelField.item) ? channelField.item : []
    let channelItems:RSSItem[] = [];
    
    for(const item of rawItems){
         if (
            typeof item?.title === "string" &&
            typeof item?.link === "string" &&
            typeof item?.description === "string" &&
            typeof item?.pubDate === "string"
        ) {
            channelItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
            });
        }
    }

    return {
        channel:{
            title:channelTitle,
            link:channelLink,
            description:channelDescription,
            items:channelItems
        }
    }

}
