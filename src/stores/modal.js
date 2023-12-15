import { defineStore } from "pinia"
import { ref } from 'vue'

export const useModalStore = defineStore('modal', ()=>{
    const modal = ref(false)

    function handleClickModal() {
        modal.value = !modal.value
    }
    function addItem(product){
        console.log(product)
    }
    return {
        addItem,
        modal,
        handleClickModal
    }
})