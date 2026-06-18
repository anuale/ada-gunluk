export async function register() {
  if (process.env["NEXT_RUNTIME"] === "nodejs") {
    const { prisma } = await import("@/lib/prisma");

    process.on("unhandledRejection", (reason, promise) => {
      console.error("UNHANDLED REJECTION:", reason);
    });

    process.on("uncaughtException", (error) => {
      console.error("UNCAUGHT EXCEPTION:", error);
      if (
        error.message?.includes("EADDRINUSE") ||
        error.message?.includes("listen EACCES")
      ) {
        process.exit(1);
      }
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      try {
        await prisma.$disconnect();
      } catch (e) {
        console.error("Error during prisma disconnect:", e);
      }
      process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }
}
