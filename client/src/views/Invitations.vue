<template>
  <div class="invitations mt-4">
    <b-container>
      <hot-table
        ref="table"
        :data="invitations"
        :settings="hotSettings"
        :height="windowHeight - 150"
      >
      </hot-table>
    </b-container>
  </div>
</template>

<script lang="ts">
import { HotTable, HotColumn } from "@handsontable/vue";
import { Component, Vue } from "vue-property-decorator";
import ApiService from "@/services/api";
import "handsontable/dist/handsontable.full.css";
import { vueWindowSizeMixin } from "vue-window-size";
import Handsontable from "handsontable";
import _ from "lodash";

import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
library.add(faCheckSquare);
dom.watch();

@Component({
  components: { HotTable, HotColumn },
  mixins: [vueWindowSizeMixin]
})
export default class Invitations extends Vue {
  hotSettings = {
    width: "100%",
    licenseKey: "non-commercial-and-evaluation",
    stretchH: "all",
    colHeaders: ["Email address", "Full name", "Accepted"],
    rowHeaders: true,
    readOnly: true,
    columns: [
      {},
      {},
      {
        renderer: function(
          instance: Handsontable,
          td: HTMLTableCellElement,
          row: any,
          col: any,
          prop: any,
          value: boolean
        ) {
          Handsontable.dom.empty(td);
          if (value) {
            const icon = document.createElement("i");
            icon.className = "fa fa-check-square";

            td.appendChild(icon);
          }
          td.className += " htCenter";

          return td;
        }
      }
    ]
  };
  invitations: [string, string, boolean][] = [];

  mounted() {
    ApiService.getInvitations().then(d => {
      this.invitations = d.map(r => [
        r.emailAddress,
        _.join([r.firstName, r.lastName], " "),
        r.accepted
      ]);
    });
  }
}
</script>
