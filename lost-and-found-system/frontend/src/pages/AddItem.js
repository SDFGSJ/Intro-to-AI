import { useState,  } from "react"
import axios from "axios"
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";

import "react-datepicker/dist/react-datepicker.css";
import Description from "../components/Description";
import Loading from "../components/Loading";

export default function AddItem({ setShowAddItem }) {
    const [canSubmit, setCanSubmit] = useState(false)
    const [date, setdate] = useState(new Date())
    const [imageLink, setImageLink] = useState("")
    const [description, setDescription] = useState("")
    const [isAnonymous, setIsAnonymouse] = useState(true)
    const [isWaiting, setIsWaiting] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [isUploadingSuccess, setIsUploadingSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const passDataToBackend = async (packagedData) => {
        setIsWaiting(true)
        setIsUploadingSuccess(false)

        await axios.post('http://127.0.0.1:4000/addItem', packagedData)
        .then(res => {
            console.log(res)
            setIsUploadingSuccess(true)
            setIsDone(true)
        })
        .catch(err => {
            console.log(err)
            setIsUploadingSuccess(false)
            setIsDone(true)
        })

        setIsWaiting(false)
    }

    const onSubmit = async (data) => {
        let lostDate = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
        let locationFound = data.locationFound;
        let finderName = isAnonymous ? "Anonymous" : data.finderName;
        let finderContact = isAnonymous ? "Empty" : data.contact;

        let packagedData = {
            "picture" : imageLink,
            "dateLost" : lostDate,
            "locationFound" : locationFound,
            "description" : description,
            "status": "Unclaimed",

            "finder" : {
                "finderName" : finderName,
                "finderContact" : finderContact,
            }
        }

        console.log(packagedData);

        await passDataToBackend(packagedData)
    };

    const uploadPicture = async (image) =>{
        const formData = new FormData()
        formData.append("image", image)

        let returnLink = ''

        await fetch("https://api.imgur.com/3/image/", {
            method: "post",
            headers: {
                Authorization: "Client-ID b27cb50169966c0",
                Accept: "application/json",
            },
            body: formData
        })
        .then(data => data.json())
        .then(data => {
            returnLink = data.data.link
            console.log(returnLink)
        })
        .catch(err => console.log(err))

        return returnLink
    }

    const getDescription = async (e) => {
        let image = e.target.files[0]
        let link = await uploadPicture(image)

        if(link)
        {
            let imageName = link.split('/').at(-1)
            let imageID = imageName.split('.')[0]
            let url = "http://127.0.0.1:4000/description/" + imageID

            await axios.get(url)
                    .then(data => setDescription(String(data.data[0].generated_text)))
                    .catch(err => console.log(err))

            console.log(description)
            setImageLink(link)
            setCanSubmit(true)
        }else
        {
            console.log('Invalid image')
        }

    }

    // deprecated
    const changeDescription = (isAddOperation) => {
        if(isAddOperation)
        {
            setDescription((prev) => [...prev, ""])
        }else
        {
            if(description.length > 1)
            {
                let newDescription = [...description]
                newDescription.pop()
                setDescription(newDescription)
            }
        }
    }


    return (
        <div className="half-transparent-background" onClick={(e) => setShowAddItem(e, false)}>
            <div className="background" onClick={(e) => e.stopPropagation()}>
                {
                    isDone || isWaiting
                    ? <Loading cancelCallback={setShowAddItem} pending={isWaiting} info={isWaiting && !isDone ? "Uploading" : (isUploadingSuccess ? "Upload success" : "Upload fail")}/>
                    :
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Lost Date */}
                        <div className="lost-data">
                            <label className="lostDate-label" htmlFor="lostDate">Lost Date:</label>
                            <DatePicker className="date-picker" showIcon selected={date} onChange={setdate}/>
                        </div>
                        {/* Lost Date */}

                        {/* Location Found */}
                        <div className="location-found">
                            <label className="locationFound-label" htmlFor="locationFound">Lost Found: </label>
                            <input type="text" name="locationFound"  placeholder='place' {...register("locationFound")}/>
                        </div>
                        {/* Location Found */}

                        {/* Picture */}
                        <div className="picture">
                            <label className="picture-label" htmlFor="picture">Picture: </label>
                            <input type="file" name="picture" onChange={getDescription}/>
                            {
                                // descriptions
                                imageLink !== ""
                                ?   <p>
                                        <label className="descrpition-label" htmlFor="description">Description: </label>
                                        {/* <button className="add-descrption" type="button" onClick={() => changeDescription(true)} >add</button>
                                        <button className="remove-descrption" type="button" onClick={() => changeDescription(false)} >remove</button> */}
                                        <Description description={description} setFunction={setDescription}/>
                                    </p>
                                : null
                            }
                        </div>
                        {/* Picture */}

                        {/* Finder */}
                        <div className="finder">
                            <label className="finder-label" htmlFor="finder">Finder: </label>
                            <input
                                type="checkbox"
                                name="finder"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymouse(e.target.checked)}
                                />
                            <label className="Anonymous-label">Anonymous</label>
                            {
                                isAnonymous === true ? null :
                                <div>
                                    <label className="Name-label" htmlFor="name">Name: </label>
                                    <input type="text" name="name" {...register("finderName")}/>
                                    <label className="Contact-label" htmlFor="contact"> Contact Info: </label>
                                    <input type="text" name="contact" {...register("contact")}/>
                                </div>
                            }
                        </div>
                        {/* Finder */}
                        <div className="form-control">
                            <button type="submit" disabled={!canSubmit}>Add</button>
                        </div>
                    </form>
                }
            </div>
        </div>
    )
}