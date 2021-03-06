<template>
  <div>
    <div class="user-brief" v-if="!long">
      <b-avatar class="photo" :src="photoURL" :text="avatarText" size="2em" />
      <p class="name">
        {{ displayName }}
      </p>
    </div>
    <div class="user-long" v-else>
      <b-avatar class="photo" :src="photoURL" :text="avatarText" size="6em" />
      <div class="text">
        <heading class="name" :level="1" :context="headingContext">
          {{ displayName }}
        </heading>
        <dl>
          <div v-if="pronouns" class="info-item">
            <dt>Pronouns</dt>
            <dd>{{ pronouns }}</dd>
          </div>
          <div v-if="institution" class="info-item">
            <dt>Affiliation</dt>
            <dd>{{ institution }}</dd>
          </div>
          <div v-if="website" class="info-item website">
            <dt>Website</dt>
            <dd>
              <a :href="website">{{ website }}</a>
            </dd>
          </div>
        </dl>
        <p v-if="bio" class="bio">{{ bio }}</p>
        <icon-button
          v-if="showSendMessage"
          icon="comment-alt"
          variant="primary"
          @click.stop="sendMessage"
        >
          Message
        </icon-button>
      </div>
    </div>

    <send-message :modalId="dmModal" :receiver="id" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from "vue-property-decorator";
import HeadingContext from "@/mixins/HeadingContext";
import Heading from "@/components/Heading";
import SendMessage from "@/components/SendMessage.vue";
import ApiService from "@/services/api";
import { User } from "@/models";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faUniversity,
  faLink,
  faEdit,
  faCommentAlt
} from "@fortawesome/free-solid-svg-icons";

library.add(faUser, faUniversity, faLink, faEdit, faCommentAlt);

@Component({ components: { Heading, SendMessage } })
export default class UserSummary extends Mixins(HeadingContext) {
  @Prop({ required: true }) displayName!: string;

  @Prop({ type: Boolean, default: false }) long!: boolean;

  @Prop({ default: "" })
  readonly photoURL!: string;

  @Prop({ default: "" })
  readonly pronouns!: string;

  @Prop({ default: "" })
  readonly institution!: string;

  @Prop({ default: "" })
  readonly website!: string;

  @Prop({ default: "" })
  readonly bio!: string;

  @Prop({ default: 0 })
  readonly id!: number;

  message = "";

  get avatarText(): string {
    return this.displayName.slice(0, 2);
  }

  get dmTitle(): string {
    return "Message " + this.displayName;
  }

  get showSendMessage(): boolean {
    const thisId = this.id.toString();
    const userId = this.$store.getters.sessionUser.id;
    const res = thisId != userId;
    return res && this.$store.getters.allowDirectMessages;
  }

  get dmModal() {
    return "direct-message-" + this.id;
  }

  sendMessage() {
    this.$bvModal.show(this.dmModal);
  }

  send() {
    const sender: User = this.$store.getters.sessionUser;
    if (sender) {
      ApiService.sendMessage({
        senderId: sender.id,
        receiverId: this.id,
        messageText: this.message,
        timestamp: new Date().getTime()
      }).then(() => this.clear());
    }
  }

  clear() {
    this.message = "";
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  overflow: hidden;
  text-overflow: ellipsis;

  dt,
  dd {
    display: inline;
  }

  dt {
    margin-right: 0.5em;
  }
}

.bio {
  max-width: 20em;
}

.website {
  white-space: nowrap;
}

.user-long {
  display: flex;
  overflow: hidden;
}

.photo {
  flex-shrink: 0;
  margin-right: 1em;
}

.text {
  overflow: hidden;
  flex-shrink: 1;
}

.user-brief {
  display: flex;
  align-items: center;

  .name {
    font-size: 1rem;
    margin: 0;
  }
}

.user-long .name {
  font-size: 1.125rem;
}

.name {
  font-weight: normal;
}

.edit-profile {
  vertical-align: super;
  font-size: 16px;
}
</style>
