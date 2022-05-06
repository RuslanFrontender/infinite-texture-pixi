<template>
  <div ref="container" class="conatiner"></div>
</template>

<script>
import { gsap } from "gsap";
import InfiniteSlider from "~/plugins/canvas.client";
export default {
  data() {
    return {
      images: [
        "/img/1.jpg",
        "/img/2.jpg",
        "/img/3.jpg",
        "/img/4.jpg",
        "/img/5.jpg",
        "/img/6.jpg",
      ],
    };
  },
  mounted() {
    this.setupCanvas();
  },
  methods: {
    setupCanvas() {
      new InfiniteSlider(this.$refs.container, this.images);
    },
  },
};
</script>
