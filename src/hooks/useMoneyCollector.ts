import { useAppSelector, useAppDispatch } from "./useRedux";
import { selectGold, addGold } from "../features/summon/summonSlice";
import { useEffect } from "react";

export default function useMoneyCollector(increment: number, intervalMs: number) {
  const gold = useAppSelector(selectGold);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(addGold(increment));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [dispatch, increment, intervalMs]);

  return gold;
}
