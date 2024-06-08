import axios from "axios";

let data = JSON.stringify({
  "name": "sample 2",
  "language": "fr",
  "category": "Receipt",
  "components": [
    {
      "type": "HEADER",
      "format": "TEXT",
      "text": "Sample Header",
      "example": {
        "header_text": [
          "Sample Header"
        ]
      }
    },
    {
      "type": "BODY",
      "text": "dfdghfhe {{2}}.",
      "example": {
        "body_text": [
          [
            "2"
          ]
        ]
      }
    },
    {
      "type": "FOOTER",
      "text": "Exemple de pied de page"
    },
    {
      "type": "BUTTONS",
      "buttons": [
        {
          "type": "PHONE_NUMBER",
          "text": "Call Us",
          "phone_number": "+123456789"
        }
      ]
    }
  ]
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://graph.facebook.com/v19.0/249632854897704/message_templates',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer EAAGBjyPxpC8BOy1O0EZBIvOEdE2wmEqplq8ZBEFhZBerw1v2qko6UCumqixoR8iDonCHfAdsG53ILmdS4Vez8ZBCBZBIdkS6ZAXzBfQhhwcSjVfqQ7jqCOi6iPjXjzP5pheBV6ah1URMmke5XL9NZBf4GngslGD3hP9mUZBk12CDBFfWsOSBI4yZAj7aGH5TggQX0ZBvcKmw04GOtgEDz8Mt2fZC8Iaj37HinIqTegZD'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
