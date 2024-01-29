import { useState, useRef, useEffect } from "react"
import axios from "axios";

import ItemBlock from "../components/ItemBlock";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";

// now replace the content https://imgur.com/a/GbM6sKT with the image ../assets/images/eat-sleep-code-repeat.jpg
// now replace the content https://imgur.com/a/y7a2zwZ with the image ../assets/images/good-day-to-code.jpg


// TODO
// 1. currently, the image can't shown properly, this problem may be caused by
// https://stackoverflow.com/questions/40489569/images-from-imgur-com-is-not-displaying-on-website
// for the implementation for the backend, we will only give the url for the image. Which I think
// will be the imgur url if expected.


// 2. Each item will have an id, which will be used to identify the item (For the example below, it will be 143 and 486)


// Backend team will create the schema for the item, which will be used to store the information for the item
// The schema will be like the following:
/*
const itemSchema = new Schema({
    description: { type: String, required: true },
    picture: { type: String, required: true }, // the url for the image
    dateLost: { type: Date }, // This can be optional
    locationFound: { type: String },
    status: { type: String, default: 'Unclaimed' }, // e.g., 'Claimed', 'Unclaimed'
    finder_name: { type: String, default: 'Anonymous' }
});
*/

// Also, the backend team will create the APIs for the frontend team to use, which will be released later on


export default function Home() {
    const [items, setItems] = useState([])
    const [isWaiting, setIsWaiting] = useState(false)

    const cancelController = useRef(new AbortController())
    
    const searchBarSubmit = (userInput) => {
        let isMessageEmpty = userInput === ""

        if(!isMessageEmpty)
        {
            let userDescriptions = userInput.split(',')
            userDescriptions = userDescriptions.map((word) => word.trim()).filter(userInput => userInput)

            getItemsFromBackend(userDescriptions)
            // setItems(() => [e.target.value, ...items])  // add item to the front to prevent scrolling
        }
    }


    const getItemsFromBackend = async (userDescriptions) => {
        if(isWaiting === true) return

        setIsWaiting(true)
        cancelController.current = new AbortController()

        await axios.post('http://127.0.0.1:4000/finding/description', {"description" : userDescriptions }, {
            signal: cancelController.current.signal
        })
        .then(res => {
            let filteredItems = res.data
            console.log(filteredItems)
            setItems(filteredItems)
        })
        .catch(err => console.log(err))

        setIsWaiting(false)
    }

    const getAllItemsFromBackend = async () => {
        let param = {
            index : 500
        }

        await axios.get('http://127.0.0.1:4000/view',  {params: param})
        .then(res => {
            let items = res.data
            console.log(items)
            setItems(items.reverse())
        })
        .catch(err => console.log(err))
    }

    const cancelFetchingItems = (e) => {
        cancelController.current.abort()
    }

    useEffect(() => {
        getAllItemsFromBackend()
    }, [])

    return (
        <div>
            {
                isWaiting 
                ? <Loading cancelCallback={cancelFetchingItems} pending={true} info="Searching..."/>
                : null
            }
            <SearchBar searchBarSubmitCallback={searchBarSubmit} />
            <br/>
            <ItemBlock items={items}> </ItemBlock>
        </div>
    )
}