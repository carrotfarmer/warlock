import React from "react";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";

interface CreateSiteFormProps {
  userId: string;
}

export const CreateSiteForm: React.FC<CreateSiteFormProps> = ({ userId }) => {
  return (
    <div>
      <Card className="max-w-lg">
        <CardContent className="pt-5">
          <form>
            <div>
              <Label>site name</Label>
              <Input placeholder="eg: twitter" />
              <p className="pt-2 text-xs text-gray-500">
                site name is used to identify your site in the dashboard.
                <br />
                you do not need to use the actual site name or include the url.
              </p>
            </div>

            <div className="pt-3">
              <Label>encryption key</Label>
              <Input />
              <p className="pt-2 text-xs text-red-500">
                NOTE: we do not store your encryption key. if you lose your encryption key, you will
                not be able to access the data related to this site. please keep your encryption key
                safe and configure a good hint.
              </p>
            </div>

            <div className="pt-3">
              <Label>encryption key hint</Label>
              <Input placeholder="eg: my chemistry teacher&apos;s name + my cat&apos;s birthday" />
              <p className="pt-2 text-xs text-gray-500">
                this hint will be shown to you if you forget your encryption key, please configure a
                good, memorable hint.
              </p>
            </div>

            <div className="pt-3 flex justify-center">
              <Button size="lg">
                create site
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
