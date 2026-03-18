"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { BotIcon, Clock3Icon, RefreshCcwIcon } from "lucide-react";
import {
  EntityContainer,
  EntityHeader,
} from "@/app/components/entity-compoents";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Label } from "@/components/label";
import { Textarea } from "@/components/textarea";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_AI_SMOKE_PROMPT } from "../shared";

const statusVariant = {
  success: "default",
  error: "destructive",
  skipped: "secondary",
} as const;

export const AITestView = () => {
  const trpc = useTRPC();
  const [prompt, setPrompt] = useState(DEFAULT_AI_SMOKE_PROMPT);

  const runSmokeTest = useMutation({
    ...trpc.ai.runSmokeTest.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  });

  const results = runSmokeTest.data?.results ?? [];

  return (
    <EntityContainer
      header={
        <EntityHeader
          title="AI Test"
          description="Run the current env-backed Google and DeepSeek providers directly inside the app"
          newButtonLabel="Run Test"
          onNew={() => runSmokeTest.mutate({ prompt })}
          isCreating={runSmokeTest.isPending}
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Prompt</CardTitle>
            <CardDescription>
              This hits the server directly and returns live output from the
              configured providers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-test-prompt">Prompt</Label>
              <Textarea
                id="ai-test-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="min-h-28"
                placeholder={DEFAULT_AI_SMOKE_PROMPT}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => runSmokeTest.mutate({ prompt })}
                disabled={runSmokeTest.isPending}
              >
                {runSmokeTest.isPending ? (
                  <>
                    <RefreshCcwIcon className="size-4 animate-spin" />
                    Running
                  </>
                ) : (
                  <>
                    <BotIcon className="size-4" />
                    Run Providers
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setPrompt(DEFAULT_AI_SMOKE_PROMPT)}
                disabled={runSmokeTest.isPending}
              >
                Reset Prompt
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Providers in this page: Google Gemini and DeepSeek only.
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {results.length === 0 ? (
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>No Run Yet</CardTitle>
                <CardDescription>
                  Trigger the smoke test to see live provider output, duration,
                  and token usage.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            results.map((result) => (
              <Card key={result.provider} className="shadow-none">
                <CardHeader className="gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle>{result.label}</CardTitle>
                      <CardDescription>{result.model}</CardDescription>
                    </div>
                    <Badge variant={statusVariant[result.status]}>
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      configured: {result.configured ? "yes" : "no"}
                    </Badge>
                    {result.finishReason && (
                      <Badge variant="outline">
                        finish: {result.finishReason}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Clock3Icon className="size-3" />
                      {result.durationMs} ms
                    </Badge>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                      Output
                    </div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs">
                      {result.text || "(no output)"}
                    </pre>
                  </div>
                  <div className="grid gap-2 text-muted-foreground sm:grid-cols-2">
                    <div>Input tokens: {result.usage.inputTokens ?? "-"}</div>
                    <div>Output tokens: {result.usage.outputTokens ?? "-"}</div>
                    <div>Total tokens: {result.usage.totalTokens ?? "-"}</div>
                    <div>
                      Reasoning tokens: {result.usage.reasoningTokens ?? "-"}
                    </div>
                  </div>
                  {result.error && (
                    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-destructive">
                      {result.error}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </EntityContainer>
  );
};
