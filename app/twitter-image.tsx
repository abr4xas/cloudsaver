import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "CloudSaver - DigitalOcean Cost Optimization";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const [boldFont, mediumFont] = await Promise.all([
    fetch(new URL("./fonts/SpaceGrotesk-Bold.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer()
    ),
    fetch(new URL("./fonts/SpaceGrotesk-Medium.ttf", import.meta.url)).then(
      (res) => res.arrayBuffer()
    ),
  ]);

  return new ImageResponse(
      (
          <div
              style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  fontFamily: "Space Grotesk",
                  backgroundColor: "#07060e",
                  position: "relative",
                  overflow: "hidden",
              }}
          >
              {/* === AMBIENT GLOW ORBS === */}
              <div
                  style={{
                      position: "absolute",
                      top: "-120px",
                      left: "-80px",
                      width: "500px",
                      height: "500px",
                      borderRadius: "50%",
                      background:
                          "radial-gradient(circle, rgba(124,58,237,0.25) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)",
                      display: "flex",
                  }}
              />
              <div
                  style={{
                      position: "absolute",
                      bottom: "-100px",
                      right: "200px",
                      width: "400px",
                      height: "400px",
                      borderRadius: "50%",
                      background:
                          "radial-gradient(circle, rgba(52,211,153,0.18) 0%, rgba(52,211,153,0.03) 40%, transparent 70%)",
                      display: "flex",
                  }}
              />
              <div
                  style={{
                      position: "absolute",
                      top: "100px",
                      right: "-50px",
                      width: "350px",
                      height: "350px",
                      borderRadius: "50%",
                      background:
                          "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)",
                      display: "flex",
                  }}
              />

              {/* === GRID OVERLAY === */}
              <div
                  style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage:
                          "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                      display: "flex",
                  }}
              />

              {/* === TOP GRADIENT LINE === */}
              <div
                  style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background:
                          "linear-gradient(90deg, transparent 0%, #7c3aed 20%, #6366f1 40%, #22d3ee 60%, #34d399 80%, transparent 100%)",
                      display: "flex",
                  }}
              />

              {/* === LEFT COLUMN: Messaging === */}
              <div
                  style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "52px 0 52px 60px",
                      width: "580px",
                      flexShrink: 0,
                  }}
              >
                  {/* Logo */}
                  <div
                      style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                      }}
                  >
                      <div
                          style={{
                              width: "42px",
                              height: "42px",
                              borderRadius: "10px",
                              background:
                                  "linear-gradient(135deg, #7c3aed, #6366f1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "18px",
                              fontWeight: 700,
                          }}
                      >
                          CS
                      </div>
                      <span
                          style={{
                              fontSize: "22px",
                              fontWeight: 700,
                              color: "rgba(255,255,255,0.55)",
                              letterSpacing: "-0.02em",
                          }}
                      >
                          CloudSaver
                      </span>
                  </div>

                  {/* Headline */}
                  <div
                      style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                      }}
                  >
                      <div
                          style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                          }}
                      >
                          <span
                              style={{
                                  fontSize: "48px",
                                  fontWeight: 700,
                                  color: "white",
                                  letterSpacing: "-0.035em",
                                  lineHeight: 1.1,
                              }}
                          >
                              Stop Wasting
                          </span>
                          <span
                              style={{
                                  fontSize: "48px",
                                  fontWeight: 700,
                                  color: "white",
                                  letterSpacing: "-0.035em",
                                  lineHeight: 1.1,
                              }}
                          >
                              Money on Your
                          </span>
                          <span
                              style={{
                                  fontSize: "48px",
                                  fontWeight: 700,
                                  letterSpacing: "-0.035em",
                                  lineHeight: 1.1,
                                  background:
                                      "linear-gradient(90deg, #a78bfa, #818cf8, #38bdf8, #34d399)",
                                  backgroundClip: "text",
                                  color: "transparent",
                              }}
                          >
                              DigitalOcean
                          </span>
                      </div>

                      <span
                          style={{
                              fontSize: "18px",
                              fontWeight: 500,
                              color: "rgba(255,255,255,0.4)",
                              lineHeight: 1.5,
                              letterSpacing: "-0.01em",
                              width: "95%",
                          }}
                      >
                          Free infrastructure analysis in under 30 seconds. No
                          sign-up. Read-only. 11 cost checks.
                      </span>
                  </div>

                  {/* Bottom bar */}
                  <div
                      style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                      }}
                  >
                      {/* CTA pill */}
                      <div
                          style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px 22px",
                              borderRadius: "100px",
                              background: "white",
                              color: "#07060e",
                              fontSize: "15px",
                              fontWeight: 700,
                              letterSpacing: "-0.01em",
                          }}
                      >
                          See My Savings
                      </div>
                      <span
                          style={{
                              fontSize: "14px",
                              fontWeight: 500,
                              color: "rgba(255,255,255,0.25)",
                          }}
                      >
                          do-cloudsaver.vercel.app
                      </span>
                  </div>
              </div>

              {/* === RIGHT COLUMN: Terminal Mock + Floating Cards === */}
              <div
                  style={{
                      display: "flex",
                      flex: 1,
                      position: "relative",
                      padding: "40px 50px 40px 20px",
                  }}
              >
                  {/* Terminal window */}
                  <div
                      style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          borderRadius: "16px",
                          border: "1px solid rgba(255,255,255,0.08)",
                          backgroundColor: "rgba(12,10,24,0.85)",
                          overflow: "hidden",
                      }}
                  >
                      {/* Title bar */}
                      <div
                          style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "14px 18px",
                              borderBottom: "1px solid rgba(255,255,255,0.06)",
                              gap: "8px",
                          }}
                      >
                          <div
                              style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: "#ef4444",
                                  display: "flex",
                              }}
                          />
                          <div
                              style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: "#eab308",
                                  display: "flex",
                              }}
                          />
                          <div
                              style={{
                                  width: "12px",
                                  height: "12px",
                                  borderRadius: "50%",
                                  backgroundColor: "#22c55e",
                                  display: "flex",
                              }}
                          />
                          <span
                              style={{
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  color: "rgba(255,255,255,0.3)",
                                  marginLeft: "8px",
                              }}
                          >
                              CloudSaver Analysis
                          </span>
                      </div>

                      {/* Terminal content */}
                      <div
                          style={{
                              display: "flex",
                              flexDirection: "column",
                              padding: "18px 20px",
                              gap: "7px",
                              fontFamily: "monospace",
                              fontSize: "13px",
                          }}
                      >
                          <span
                              style={{
                                  color: "rgba(255,255,255,0.35)",
                                  display: "flex",
                              }}
                          >
                              $ cloudsaver analyze --token dop_v1_***
                          </span>
                          <span
                              style={{
                                  color: "rgba(255,255,255,0.2)",
                                  display: "flex",
                                  marginTop: "4px",
                              }}
                          >
                              Scanning infrastructure...
                          </span>
                          <div style={{ display: "flex", gap: "6px" }}>
                              <span style={{ color: "#22c55e" }}>✓</span>
                              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                  Found 3 zombie droplets
                              </span>
                              <span style={{ color: "#f97316" }}>— $72/mo</span>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                              <span style={{ color: "#22c55e" }}>✓</span>
                              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                  Found 5 old snapshots
                              </span>
                              <span style={{ color: "#f97316" }}>— $18/mo</span>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                              <span style={{ color: "#22c55e" }}>✓</span>
                              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                  Found 2 oversized DBs
                              </span>
                              <span style={{ color: "#f97316" }}>— $96/mo</span>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                              <span style={{ color: "#22c55e" }}>✓</span>
                              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                  Found 1 idle load balancer
                              </span>
                              <span style={{ color: "#f97316" }}>— $12/mo</span>
                          </div>
                          <div style={{ display: "flex", gap: "6px" }}>
                              <span style={{ color: "#22c55e" }}>✓</span>
                              <span style={{ color: "rgba(255,255,255,0.5)" }}>
                                  Found 4 unattached volumes
                              </span>
                              <span style={{ color: "#f97316" }}>— $49/mo</span>
                          </div>

                          {/* Divider */}
                          <div
                              style={{
                                  display: "flex",
                                  borderTop: "1px solid rgba(255,255,255,0.06)",
                                  marginTop: "6px",
                                  paddingTop: "10px",
                                  flexDirection: "column",
                                  gap: "4px",
                              }}
                          >
                              <div style={{ display: "flex", gap: "6px" }}>
                                  <span
                                      style={{
                                          color: "rgba(255,255,255,0.35)",
                                      }}
                                  >
                                      Resources scanned:
                                  </span>
                                  <span
                                      style={{
                                          color: "white",
                                          fontWeight: 700,
                                      }}
                                  >
                                      47
                                  </span>
                              </div>
                              <div style={{ display: "flex", gap: "6px" }}>
                                  <span
                                      style={{
                                          color: "rgba(255,255,255,0.35)",
                                      }}
                                  >
                                      Opportunities found:
                                  </span>
                                  <span
                                      style={{
                                          color: "white",
                                          fontWeight: 700,
                                      }}
                                  >
                                      15
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* === FLOATING SAVINGS CARD === */}
                  <div
                      style={{
                          position: "absolute",
                          bottom: "28px",
                          right: "30px",
                          display: "flex",
                          flexDirection: "column",
                          padding: "16px 22px",
                          borderRadius: "14px",
                          border: "1px solid rgba(52,211,153,0.25)",
                          backgroundColor: "rgba(12,10,24,0.9)",
                          gap: "2px",
                      }}
                  >
                      <span
                          style={{
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "rgba(52,211,153,0.7)",
                              letterSpacing: "0.05em",
                              textTransform: "uppercase" as const,
                          }}
                      >
                          Potential Savings
                      </span>
                      <span
                          style={{
                              fontSize: "36px",
                              fontWeight: 700,
                              background:
                                  "linear-gradient(90deg, #34d399, #22d3ee)",
                              backgroundClip: "text",
                              color: "transparent",
                              letterSpacing: "-0.03em",
                              lineHeight: 1.1,
                          }}
                      >
                          $247/mo
                      </span>
                  </div>
              </div>
          </div>
      ),
      {
          ...size,
          fonts: [
              {
                  name: "Space Grotesk",
                  data: boldFont,
                  style: "normal",
                  weight: 700,
              },
              {
                  name: "Space Grotesk",
                  data: mediumFont,
                  style: "normal",
                  weight: 500,
              },
          ],
      }
  );
}
