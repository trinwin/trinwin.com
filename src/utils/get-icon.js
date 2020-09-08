// @flow strict
import { ICONS } from "../constants";

const getIcon = (name: string) => {
  let icon;

  switch (name) {
    case "twitter":
      icon = ICONS.TWITTER;
      break;
    case "github":
      icon = ICONS.GITHUB;
      break;
    case "email":
      icon = ICONS.EMAIL;
      break;
    case "linkedin":
      icon = ICONS.LINKEDIN;
      break;
    case "instagram":
      icon = ICONS.INSTAGRAM;
      break;
    case "facebook":
      icon = ICONS.FACEBOOK;
      break;
    case "medium":
      icon = ICONS.MEDIUM;
      break;
    case "dev":
      icon = ICONS.DEV;
      break;
    case "unsplash":
      icon = ICONS.UNSPLASH;
      break;
    case "gitlab":
      icon = ICONS.GITLAB;
      break;
    case "rss":
      icon = ICONS.RSS;
      break;
    case "line":
      icon = ICONS.LINE;
      break;
    case "vkontakte":
      icon = ICONS.VKONTAKTE;
      break;
    case "telegram":
      icon = ICONS.TELEGRAM;
      break;
    case "weibo":
      icon = ICONS.WEIBO;
      break;
    default:
      icon = {};
      break;
  }

  return icon;
};

export default getIcon;
