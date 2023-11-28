import { ref, computed, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useCouponStore } from './coupons'
import { collection, addDoc, runTransaction, doc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { getCurrentDate } from '../helpers'


export const useCartStore = defineStore('cart', () => {

    const coupon = useCouponStore()
    const db = useFirestore()
    // cart state
    const items = ref([])
    const subtotal = ref(0)
    const taxes= ref(0)
    const total = ref(0)
   
    // taxes y products
    const MAXPRODUCTS = 5
    const TAXRATE = .19 //impuestos

    watchEffect(() => {
        subtotal.value = items.value.reduce((total, item) => total + (item.quantity * item.price), 0)
        taxes.value = Number ((subtotal.value * TAXRATE).toFixed(2)) //impuestos
        total.value = Number (((subtotal.value + taxes.value) - coupon.discount).toFixed(2))
    })


    function addItem(item){
        const index = isItemCart(item.id)
        if(index >= 0) {
            if(isProductAvailable(item, index)){
                alert('Has alcanzado el limite')
                return
            }
            //actualizar la cantidad
            items.value[index].quantity++
        }else{
            items.value.push({...item, quantity: 1, id: item.id})
        }
    }
    function updateQuantity(id, quantity) {
       items.value = items.value.map( item => item.id === id ? {...item, quantity} : item )
    }
    function removeItem(id) {
        items.value = items.value.filter(item => item.id !== id)
    }
    async function checkout() {
        try {
            await addDoc(collection(db, 'sales'), {
                items: items.value.map(item => {
                    const { availability, category, ...data} = item
                    return data
                }),
                subtotal: subtotal.value,
                taxes: taxes.value,
                total: total.value,
                discount: coupon.discount,
                date: getCurrentDate()
            })
            //Sustraer la cantidad 
            items.value.forEach( async(item) => {
                const productRef = doc(db, 'products', item.id)
                await runTransaction(db, async (transaction) => {
                    const currentProduct = await transaction.get(productRef)
                    const availability = currentProduct.data().availability - item.quantity
                    transaction.update(productRef, { availability })
                })
            })
            //reiniciar el state
           $reset()
           coupon.$reset()

        } catch (error) {
            console.log(error)
        }
    }
    function $reset() {
        items.value = []
        subtotal.value = 0
        taxes.value = 0
        total.value = 0
    }
    const isItemCart = id => items.value.findIndex(item => item.id === id)

    const isProductAvailable = (item, index) => {
        return items.value[index].quantity >= item.availability || items.value[index].quantity >= MAXPRODUCTS
    }

    const isEmpty = computed(() => items.value.length === 0)

    const checkProductAvailability = computed(() => {
        return (product) => product.availability < MAXPRODUCTS ? product.availability : MAXPRODUCTS
    })

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        checkout,
        taxes,
        total,
        subtotal,
        isEmpty,
        checkProductAvailability
    }
})