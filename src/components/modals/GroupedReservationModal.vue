<template>
  <Modal size="modal-lg">
    <template #content>
      <reservation-form
        v-if="
          formStore.formToShow === 'add reservation' ||
          formStore.formToShow === 'edit reservation'
        "
        :url="url"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />

      <reservation-search-form
        v-if="formStore.formToShow === 'search reservation'"
        :url="url"
        @emptyTable="emptyTable"
        @fetchData="fetchData($event)" />

      <div v-if="formStore.formToShow === 'delete reservation'">
        <div class="mt-0 text-center text-3xl">
          PROCEDERE CON ELIMINAZIONE DELLA PRENOTAZIONE ESEGUITA DA CODICE
          SOSTENITORE
          <strong>{{ formStore.data.idSostenitorecheck }}</strong
          >?
        </div>
        <div class="clear-both mt-14">
          <div class="flex justify-center gap-4">
            <Button
              label="Elimina"
              class="p-button-text font-semibold uppercase text-3x bg-red-400 text-black"
              :class="'p-button-' + formStore.color"
              @click="handleDelete">
              <i class="pi pi-trash mr-2 text-3xl"></i>
              CONFERMA
            </Button>
            <Button
              label="Modifica"
              class="p-button-text font-semibold uppercase text-3xl bg-blue-400 text-black"
              :class="'p-button-' + formStore.color"
              @click="handleAnnulla">
              <i class="pi pi-pencil mr-2 text-3xl"></i>
              ANNULLA
            </Button>
          </div>
        </div>
      </div>

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
import ReservationSearchForm from "@/components/forms/ReservationSearchForm.vue";
import { useModalStore } from "../../store/modals";
import axios from "axios";
// import { errorToast, warningToast, successToast } from "@/utils/toast";
import { successToast } from "@/utils/toast";

export default {
  name: "GroupedReservationModal",
  props: ["url"],
  emits: ["emptyTable", "fetchData"],
  components: {
    ReservationForm,
    ReservationSearchForm,
    GroupedReservationDetail,
    Modal,
  },
  setup(props, context) {
    const formStore = useFormStore();
    const modalStore = useModalStore();
    const emptyTable = () => {
      context.emit("emptyTable", true);
    };

    const fetchData = (event) => {
      context.emit("fetchData", event);
    };

    const handleAnnulla = () => {
      modalStore.close();
    };

    const handleDelete = async () => {
      const url = process.env.VUE_APP_API_URL + "/deleteReservation";
      try {
        await axios.delete(url, {
          data: {
            idSostenitorecheck: formStore.data.idSostenitorecheck,
            idDat: formStore.data.idDat,
          },
        });
        console.log("Prenotazione eliminata con successo");
        successToast();
      } catch (error) {
        console.error(
          "Errore durante l'eliminazione:",
          error.response?.data?.message || error.message
        );
      }

      modalStore.close();
    };

    return { emptyTable, fetchData, formStore, handleAnnulla, handleDelete };
  },
};
</script>
