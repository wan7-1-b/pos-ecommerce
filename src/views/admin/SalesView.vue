<script setup>
    import { ref } from 'vue'
    import VueTailwindDatePicker from 'vue-tailwind-datepicker'
    import { useSalesStore } from '../../stores/sales'
    import SalesDetails from '../../components/SaleDetails.vue'
    import { formatCurrency } from '../../helpers'
    

    const sales = useSalesStore()    

    const formatter = ref({
        date: 'DD/MM/YYYY',
        month: 'MMMM'
    })
</script>
<template>
     <h1 class="text-4xl font-black my-10">Resumen de Ventas</h1>
    <div class="md_flex md:items-start gap-5">
        <div class="md:w-1/2 lg:w-1/3 bg-white flex justify-center p-5">
            <VueTailwindDatePicker 
                i18n="es-es"
                as-single
                no-input
                v-model="sales.date"
                :formatter="formatter"
            />
            
        </div>
        <div class="md:w-1/2 lg:w-2/3 space-y-5 lg:h-screen lg:overflow-y-scroll p-5 pb-32">
           <p
             class="text-center text-lg"
             v-if="sales.isDateSelected"
            >
                Ventas de la fecha: <span class="font-black">{{ sales.date }}</span>
           </p>
           <p v-else class="text-center text-lg">Selecciona una Fecha</p>

           <div v-if="sales.salesCollection.length" class="space-y-5">
                     <p class="text-right text-2xl">Total del dia:
                        <span class="font-black">
                            {{ formatCurrency(sales.totalSalesOfDay) }}
                        </span>
                    </p>
                <SalesDetails 
                    v-for="sale in sales.salesCollection"
                    :key="sale._id"
                    :sale="sale"
                />
          
           </div>
              <p v-else-if="sales.noSales" class="text-lg text-center">No hay ventas en este dia</p>
        </div>
       
    </div>
</template>