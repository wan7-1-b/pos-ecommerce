import { defineStore } from "pinia"
import { ref, watch, computed } from 'vue'
import { useCartStore } from "./cart"

export const useCouponStore = defineStore('coupon', () =>{

    const cart = useCartStore()
    const couponInput = ref ('')
    const couponValidationMessage = ref('')
    const discountPercentage = ref(0)
    const discount = ref(0)

    const VALID_COUPONS = [
        {name: '3DESCUENTO', discount: 0.3},
        {name: '5DESCUENTO', discount: 0.5},
        {name: '10DESCUENTO', discount: .10},
    ]

    watch(discountPercentage, () => {
        discount.value = (cart.total * discountPercentage.value).toFixed(2)
    })

    function applyCoupon() {
        if(VALID_COUPONS.some(coupon => coupon.name === couponInput.value)) {
            couponValidationMessage.value = 'Aplicando...'

            setTimeout(() => {
                discountPercentage.value = VALID_COUPONS.find(coupon => coupon.name === couponInput.value).discount
                couponValidationMessage.value = 'Descuento Aplicado'

            }, 3000);
        }else{
            couponValidationMessage.value = 'No existe ese cupon'
        }
        setTimeout(() => {
            couponValidationMessage.value = ''
        }, 6000);
    }
    function $reset(){
            couponInput = ''
            couponValidationMessage = ''
            discountPercentage = 0
            discount = 0
    }
    const isValidCoupon = computed(() => discountPercentage.value > 0)

    return{
        couponInput,
        discount,
        applyCoupon,
        $reset,
        couponValidationMessage,
        isValidCoupon
    }
})