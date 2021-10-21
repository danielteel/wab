import { Menu } from "semantic-ui-react";

export default function WABMenu({setSelectedMenu, selectedMenu}){
    const menuItems=[
        {id:'formfs', title: 'Form Fs'},
        {id:'standardkit', title:'Standard Kit'},
        {id:'standardcargo', title:'Standard Cargo'},
        {id:'aircraft', title:'Aircraft'}
    ]

    return (
        <Menu attached>
            {
                menuItems.map( item => <Menu.Item
                    key={"menu"+item.id}
                    name={item.title}
                    active={selectedMenu === item.id}
                    onClick={()=>setSelectedMenu(item.id)}
                  />)
            }
        </Menu>
    );
}