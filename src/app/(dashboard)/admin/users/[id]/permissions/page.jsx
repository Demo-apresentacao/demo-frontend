import UserPermissionsClient from "./UserPermissionsClient";

import { Can } from "@/components/ui/can";
import AccessDenied from "@/components/ui/accessDenied";

export default async function UserPermissionsPage({ params }) {
  
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <Can perform="permissoes.visualizar" fallback={<AccessDenied />}>
      <UserPermissionsClient userId={id} />
    </Can>
  );
}