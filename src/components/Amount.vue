<script setup>

</script>
<template>
    <div class="flex justify-between p-1">
        <dt>
            <slot name="label" />
        </dt>
        <dd class="text-gray-900">
            <slot></slot>
        </dd>

    </div>
</template>