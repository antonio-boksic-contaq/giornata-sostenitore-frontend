<template>
  <!-- <grouped-reservation-table
    :rows="rows"
    :url="url"
    @fetchData="fetchData($event)"
    @emptyTable="emptyRows" /> -->

  <!-- <div>{{ modalStore.detailItem }}</div> -->
  <hourly-reservation-table :rows="reservations" />
  HOURLY RESERVATIONS:
  <div>{{ reservations }}</div>
</template>
<script>
import { ref } from "vue";
import { get } from "@/utils/axios";
import { onBeforeMount } from "@vue/runtime-core";
import { useLoadingStore } from "@/store/loadings";
import { useAuthStore } from "@/store/auth";
import { parseItDateTime, parseItDate } from "@/utils/date";
import HourlyReservationTable from "@/components/tables/HourlyReservationTable.vue";
import { useModalStore } from "@/store/modals";

export default {
  name: "TaskDetail",
  components: { HourlyReservationTable },
  props: [],
  emits: [],
  setup() {
    const loadingStore = useLoadingStore();
    const modalStore = useModalStore();
    const authStore = useAuthStore();
    const url =
      process.env.VUE_APP_API_URL +
      "/detailAppuntamentoGiornaliero" +
      "?centroGDS=" +
      modalStore.detailItem.centro +
      "&giornoGDS=" +
      modalStore.detailItem.data +
      "&timeOfDay=" +
      modalStore.detailItem.fasciaGiorno;

    const reservations = ref([]);

    onBeforeMount(async () => {
      console.log("detailitem", modalStore.detailItem);
      await fetchDetail();
    });

    const fetchDetail = async () => {
      loadingStore.load();
      const response = await get(authStore.accessToken, url);
      console.log("response.data", response.data);
      reservations.value = response.data;
      loadingStore.stop();
    };

    return {
      parseItDateTime,
      parseItDate,
      fetchDetail,
      modalStore,
      reservations,
    };
  },
};
</script>
