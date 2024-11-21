import { DrillUploadForm } from '@/components/forms/DrillUploadForm';

export default function UploadDrillPage() {
  return (
    <div className="container max-w-2xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload New Drill</h1>
          <p className="text-muted-foreground">
            Fill in the details below to upload a new drill to the platform.
          </p>
        </div>
        <DrillUploadForm />
      </div>
    </div>
  );
}
