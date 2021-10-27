import { Menu } from "semantic-ui-react";

export default function WABMenu({setSelectedMenu, selectedMenu}){
    const menuItems=[
        {id:'formfs', title: 'Form Fs'},
        {id:'aircraft', title:'Aircraft'},
        {id:'standardkit', title:'Kit Presets'},
        {id:'standardcargo', title:'Cargo Presets'}
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