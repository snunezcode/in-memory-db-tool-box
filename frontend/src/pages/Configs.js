
export const configuration = 
{
    "apps-settings": {
        "refresh-interval": 10*1000,
        "api-url": "",
        "release" : "0.1.0",
        "application-title": "AWS ElasticCache - Demo Data Types",
    }
    
};

export const SideMainLayoutHeader = { text: 'Data Types', href: '#/' };

export const SideMainLayoutMenu = [
    {
      text: 'Resources',
      type: 'section',
      defaultExpanded: true,
      items: [
          { type: "link", text: "Counter", href: "/?codeid=dt01" },
          { type: "link", text: "LeaderBoard", href: "/?codeid=dt02" },
          { type: "link", text: "Api Caching", href: "/?codeid=dt03" },
          { type: "link", text: "Seat Selection", href: "/?codeid=dt04" },
          { type: "link", text: "Shopping Cart", href: "/?codeid=dt05" },
          { type: "link", text: "User Directory", href: "/?codeid=dt06" },
          { type: "link", text: "Geospatial", href: "/?codeid=dt07" },
      ],
    },
    { type: "divider" },
    {
          type: "link",
          text: "Documentation",
          href: "https://github.com/rlunar/redis-tool-box",
          external: true,
          externalIconAriaLabel: "Opens in a new tab"
    }
  ];


export const breadCrumbs = [{text: 'Service',href: '#',},{text: 'Resource search',href: '#',},];



  