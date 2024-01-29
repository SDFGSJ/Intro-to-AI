import Item from "./Item"


export default function ItemBlock({ items }) {

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
            items.map((item, idx) => {
                return <Item key={idx} description={item.description} picture={item.picture} dateLost={item.dateLost} locationFound={item.locationFound} status={item.status} finder={item.finder}/>
            })
        }
        </div>
    )
}