## The description for api in the backmd 

### 輸入url得到description
方法: get
使用網址: http://127.0.0.1:4000/description/rwC9sD0
後面那段的網址是: https://i.imgur.com/rwC9sD0.jpg  的 rwC9sD0
response: 
[
    {
        "generated_text": "there is a usb drive that is laying on a table"
    }
]

### add item
方法: post 
使用網址: http://127.0.0.1:4000/addItem
需要確定的是傳過來的body必須類似以下的樣子
{
    "description": "Black leather wallet",
    "picture": "https://example.com/images/wallet.jpg",
    "dateLost": "2024-01-03",
    "locationFound": "Main Street Park",
    "status": "Unclaimed",
    "finder": {
        "name": "Test Test",
        "contact": "0912345678"
    }
}
response: successfully insert or error code

### delete item
方法: get
使用網址: http://127.0.0.1:4000/delete/6597a762179c12b9eb7d3d51
假設我有一筆data是
{
    "_id": {
        "$oid": "6597a762179c12b9eb7d3d51"
    },
    "description": "Black leather wallet",
    "picture": "https://example.com/images/wallet.jpg",
    "dateLost": {
        "$date": {
            "$numberLong": "1704240000000"
        }
    },
    "locationFound": "Main Street Park",
    "status": "Unclaimed",
    "finder": {
        "name": "Test Test",
        "contact": "0912345678",
        "_id": {
            "$oid": "6597a762179c12b9eb7d3d52"
        }
    }
}
則把她的old id裡面的字串複製下來
response: successfully delete or error code

### find items
方法: post 
使用網址: http://127.0.0.1:4000/finding/description
body: 為一段任意字串
response: top five document 除了vector以外的東西都會被回傳回來
[
    {
        "_id": "659a119d892f996a1c3e6f6d",
        "description": [
            "Mikufuwa"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T02:51:06.496Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a119d892f996a1c3e6f6e"
        },
        "score": 0.5783886313438416
    },
    {
        "_id": "659a15fc6fee8bd25e3110de",
        "description": [
            "Mikufuwa"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T03:09:45.784Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a15fc6fee8bd25e3110df"
        },
        "score": 0.5783886313438416
    },
    {
        "_id": "659a112c453c7a2d9ae2b67d",
        "description": [
            "Black leather wallet"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T02:49:13.516Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a112c453c7a2d9ae2b67e"
        },
        "score": 0.5433688759803772
    },
    {
        "_id": "659a4c15b227fc7744a075ad",
        "description": [
            "Black leather wallet"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T02:49:13.516Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a112c453c7a2d9ae2b67e"
        },
        "score": 0.5433688759803772
    }
]

### view
方法: get
使用網址: ttp://127.0.0.1:4000/view?p=20&index=10
index 為一個一頁顯示幾個 page 為第幾頁
response: 除了vector以外的東西都會被回傳回來
[
    {
        "_id": "659a15fc6fee8bd25e3110de",
        "description": [
            "Mikufuwa"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T03:09:45.784Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a15fc6fee8bd25e3110df"
        }
    },
    {
        "_id": "659a119d892f996a1c3e6f6d",
        "description": [
            "Mikufuwa"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T02:51:06.496Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a119d892f996a1c3e6f6e"
        }
    },
    {
        "_id": "659a112c453c7a2d9ae2b67d",
        "description": [
            "Black leather wallet"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T02:49:13.516Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a112c453c7a2d9ae2b67e"
        }
    },
    {
        "_id": "659a4c15b227fc7744a075ad",
        "description": [
            "Black leather wallet"
        ],
        "picture": "https://example.com/images/wallet.jpg",
        "dateLost": "2024-01-07T02:49:13.516Z",
        "locationFound": "Main Street Park",
        "status": "Unclaimed",
        "finder": {
            "name": "Test Test",
            "contact": "0912345678",
            "_id": "659a112c453c7a2d9ae2b67e"
        }
    }
]