import NoResult from "./no-result.vue";
import createLoadingLikeDirective from "@/utils/create-loading-like-directive";

const noResultDirective = createLoadingLikeDirective(NoResult);

export default noResultDirective;
