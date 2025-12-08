import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CircleAlertIcon } from "lucide-react";
import { toast } from "sonner";

export const DeleteButton = ({ api }) => {
  const handleDelete = () => {
    const promise = fetch(api, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    toast.promise(promise, {
      loading: "Đang xóa...",
      success: (data) => {
        if (data.code == "success") {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return data.message;
        }
      }
    });
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button>Delete</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlertIcon className="opacity-80" size={16} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Do you really want to delete?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={"bg-[var(--main)] hover:bg-[var(--main-hover)]"} onClick={handleDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}