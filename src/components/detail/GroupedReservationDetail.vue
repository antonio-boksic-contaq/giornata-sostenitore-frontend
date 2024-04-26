<template>
  <!-- <grouped-reservation-table
    :rows="rows"
    :url="url"
    @fetchData="fetchData($event)"
    @emptyTable="emptyRows" /> -->
  <div>{{ modalStore.detailItem }}</div>
</template>
<script>
import { ref } from "vue";
import { get } from "@/utils/axios";
import { onBeforeMount } from "@vue/runtime-core";
import { useLoadingStore } from "@/store/loadings";
import { pdf } from "@/utils/axios";
import { useAuthStore } from "@/store/auth";
import { parseItDateTime, parseItDate } from "@/utils/date";
// import GroupedReservationTable from "@/components/tables/GroupedReservationTable.vue";
import { useModalStore } from "@/store/modals";

export default {
  name: "TaskDetail",
  // components: { GroupedReservationTable },
  props: ["selectedTaskId", "url"],
  emits: ["fetchData"],
  setup(props) {
    const loadingStore = useLoadingStore();
    const modalStore = useModalStore();
    const authStore = useAuthStore();
    const selectedTask = ref(null);
    const urlTask =
      process.env.VUE_APP_API_URL + "/tasks/" + props.selectedTaskId;

    onBeforeMount(async () => {
      // await fetchTask();
      console.log("questo è il fetch di task detail", selectedTask);
    });

    const handleEmit = (event) => {
      console.log("event in task detail", event);
      selectedTask.value = event;
    };

    const fetchTask = async () => {
      loadingStore.load();
      const response = await get(authStore.accessToken, urlTask);
      selectedTask.value = response.data;
      loadingStore.stop();
    };

    const checkCurrentTask = () => {
      console.log(
        "vediamo task attualmente nel componente",
        props.selectedTaskId
      );
    };

    const downloadAttachment = async (fileId, fileName) => {
      loadingStore.load();
      await pdf(
        authStore.accessToken,
        process.env.VUE_APP_API_URL +
          "/task-attachments/" +
          fileId +
          "/download",
        fileName
      );
      loadingStore.stop();
    };
    return {
      downloadAttachment,
      parseItDateTime,
      parseItDate,
      handleEmit,
      checkCurrentTask,
      selectedTask,
      urlTask,
      fetchTask,
      modalStore,
    };
  },
};
</script>
