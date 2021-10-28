import { useLocalStorageArray } from "../useLocalStorage";
import KitOrCargo from "./KitOrCargo";

export default function KitCargoPreset({isKit}){
    const [items, addItem, deleteItem, setItem, mergeItem]=useLocalStorageArray('wab', isKit?'kit':'cargo');

    return <KitOrCargo title={isKit?'Kit Presets':'Cargo Presets'} items={items} addItem={addItem} deleteItem={deleteItem} setItem={setItem} mergeItem={mergeItem}/>
}