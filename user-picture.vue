<template>
    <div class="user-picture avatar">
        <picture v-if="user.image">
            <img :src="getImgUrl(user.image)">
        </picture>
        <div v-else>
            <picture v-if="profile">
                <img src="../../assets/default-avatar.png">
            </picture>
            <div class="user-picture__avatar" v-else>
                {{getShortName()}}
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from "vuex";

    export default {
        props: [ 'profile' ],
        computed: mapState({
            user: state => state.user,
        }),
        methods: {
            getImgUrl(path) {
                return require(path);
            },
            getShortName() {
                if (this.user && this.user.firstName) {
                    return `${this.user.firstName[0]}${this.user.lastName[0]}`;
                }
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../css/colors.scss";

    .user-picture {
        &__avatar {
            width: 45px;
            height: 45px;
            background-color: $charcoal-grey-three;
            border-radius: 45px;
            line-height: 45px;
            font-family: Raleway;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 0.4px;
            color: $white;
        }

        &.avatar {
            img {
                width: 65px;
                height: 65px;
                border-radius: 65px;
            }
        }

        img {
            width: 45px;
            height: 45px;
            border-radius: 45px;
        }
    }

    /*small phone*/
    @media (max-width: 374px) {
        .hidden-xs-only,
        .hidden-md-and-down {
            display: none !important;
        }

        .hidden-md-and-up,
        .hidden-sm-and-up {
            display: flex !important;
        }
    }
    /*big phone*/
    @media (min-width: 375px) {
        .hidden-xs-only,
        .hidden-md-and-down {
            display: none !important;
        }

        .hidden-md-and-up,
        .hidden-sm-and-up {
            display: flex !important;
        }
    }
    /*small tablet*/
    @media (min-width: 768px) {
        .hidden-xs-only {
            display: flex !important;
        }

        .hidden-sm-and-up {
            display: none !important;
        }
    }
    /*big tablet*/
    @media (min-width: 993px) {
    }
    /*laptop*/
    @media (min-width: 1264px) {
        .hidden-md-and-down {
            display: flex !important;
        }

        .hidden-lg-and-up {
            display: none !important;
        }
    }
    /*pc*/
    @media (min-width: 1664px) {
    }
</style>
