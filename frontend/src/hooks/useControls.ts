import { useQuery } from "@tanstack/react-query";
import { getControls, type ControlStatus } from "@/api/controls";

/** Server-state hook — replaces the prototype's window.DATA reads. */
export function useControls(filter: { framework?: string; status?: ControlStatus } = {}) {
  return useQuery({
    queryKey: ["controls", filter],
    queryFn: () => getControls(filter),
  });
}
