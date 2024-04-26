<template>
  <v-select
    v-model="selectedValue"
    :reduce="(element) => element[label]"
    :options="options"
    :multiple="multiple"
    :label="labelField"
    :placeholder="placeholderValue()"
    transition="slide-down">
    <template #no-options>Non ci sono opzioni disponibili</template>
    <template v-slot:selected-option="option">
      {{ handleOption(option) }}
    </template>
    <template v-slot:option="option">
      {{ handleOption(option) }}
    </template>
  </v-select>
  <!-- input se valore da selezionare è multiplo -->
  <select
    class="hidden"
    v-if="multiple"
    v-model="selectedValue"
    :id="field"
    :name="field + '[]'"
    multiple>
    <option v-for="option in options" :key="option.id">
      {{ option.id }}
    </option>
  </select>
  <!-- input se valore da selezionare è uno solo -->
  <input
    v-if="!multiple"
    type="hidden"
    :name="field"
    :id="field"
    v-model="selectedValue" />
</template>
<script>
import { onMounted, ref, watch } from "vue";
export default {
  name: "VueSelect",
  props: [
    "doubleEmit",
    "field",
    "label",
    "multiple",
    "placeholder",
    "options",
    "value",
  ],
  emits: ["selectedValueChange"],
  setup(props, context) {
    const selectedValue = ref(props.value);
    const optionValues = ref([]);
    const hiddenSelectOptions = ref([]);
    const placeholderValue = () => {
      if (props.placeholder === undefined) {
        return props.multiple
          ? "Cerca e seleziona uno o più elementi"
          : "Cerca e seleziona un elemento";
      }
      return props.placeholder;
    };

    const labelField = props.label.includes("|") ? "itemData" : props.label;

    onMounted(() => {
      if (
        props.multiple === true &&
        props.value !== undefined &&
        props.value !== null &&
        props.value.length > 0
      ) {
        selectedValue.value.forEach((element) =>
          optionValues.value.push(element.id)
        );
        selectedValue.value = optionValues.value;
      }
    });

    // questa watch cambia selectedValue e lo imposta = value quando cambio props.value
    watch(
      () => props.value,
      (value) => (selectedValue.value = value)
    );

    // questa watch fa partire un emit quando cambio selectedValue
    watch(selectedValue, (selectedValue, oldValue) => {
      if (
        selectedValue != oldValue &&
        ((selectedValue !== null && String(selectedValue).length > 0) ||
          (oldValue !== null && String(oldValue).length > 0))
      ) {
        console.log("siaaamo DENTRNOTRNOTNROTNORNTORNTO");
        // doubleemit non lo passo mai da ReservationForm come props quindi non entro mai qua dentro
        if (props.doubleEmit !== undefined) {
          context.emit("selectedValueChange", { oldValue, selectedValue });
          //entro sempre qua dentro
        } else {
          console.log(
            "vediamo selectedValue che emetto e uso nello state",
            selectedValue
          );
          context.emit("selectedValueChange", selectedValue);
        }
      }
    });

    const handleOption = (option) => {
      if (props.label.includes("|")) {
        let optionLabel = "";
        props.label.split("|").forEach((e) => {
          if (e.includes(".")) {
            const splitted = e.split(".");
            if (Object.prototype.hasOwnProperty.call(option, splitted[0]))
              optionLabel += option[splitted[0]][splitted[1]] + " - ";
          } else {
            if (
              Object.prototype.hasOwnProperty.call(option, e) &&
              option[e] !== null
            )
              optionLabel += option[e] + " ";
          }
        });
        return optionLabel;
      } else {
        //entriamo sempre nell'else perchè in ReservationForm label non include mai il pipe
        //questo metodo praticamente mi consente di renderizzare solo la proprietà che ho in props.label
        return option[props.label];
      }
    };

    return {
      handleOption,
      hiddenSelectOptions,
      labelField,
      placeholderValue,
      selectedValue,
    };
  },
};
</script>
