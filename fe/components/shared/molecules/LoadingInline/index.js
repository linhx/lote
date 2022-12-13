import { classNames } from "../../../../utils";
import style from './style.module.css';

export default function LoadingInline({ className, isLoading }) {
  return (
    <span className={classNames(className, isLoading ? style['loader'] : '')}>
    </span>
  )
}
