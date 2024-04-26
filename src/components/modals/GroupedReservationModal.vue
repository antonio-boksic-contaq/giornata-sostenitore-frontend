<template>
  <Modal size="modal-lg">
    <template #content>
      <reservation-form
        v-if="formStore.formToShow === 'reservation'"
        :project="project"
        :project_id="project_id"
        :url="url"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />
      <grouped-reservation-detail
        v-if="formStore.formToShow === 'reservationsByHour'" />
    </template>
  </Modal>
</template>
<script>
import Modal from "@/components/shared/Modal.vue";
import GroupedReservationDetail from "@/components/detail/GroupedReservationDetail.vue";
import { useFormStore } from "@/store/forms";
import ReservationForm from "@/components/forms/ReservationForm.vue";

export default {
  name: "GroupedReservationModal",
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    ReservationForm,
    GroupedReservationDetail,
    Modal,
  },
  setup(props, context) {
    const formStore = useFormStore();
    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    return { emptyTable, fetchData, formStore };
  },
};
</script>
