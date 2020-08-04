<template>
    <div id="app">
        <HintTracker/>
    </div>
</template>

<script>
    import HintTracker from "./components/HintTracker.vue";

    export default {
        name: "App",
        components: {
            HintTracker,
        },
    };
</script>

<style lang="scss">
@import "assets/scss/app.scss";
</style>
