export default function LivingCore({ compact = false }: { compact?: boolean }) {
  return <div className={"living-core " + (compact ? "living-core--compact" : "")} aria-hidden="true">
    <svg viewBox="0 0 720 720" fill="none" role="presentation" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="field-glow"><stop stopColor="#7CE9D2" stopOpacity=".38"/><stop offset=".48" stopColor="#2DB8C5" stopOpacity=".17"/><stop offset="1" stopColor="#0D3444" stopOpacity="0"/></radialGradient>
        <linearGradient id="field-ribbon-a" x1="70" y1="90" x2="600" y2="600" gradientUnits="userSpaceOnUse"><stop stopColor="#FFCC8B"/><stop offset=".3" stopColor="#EE7A4B"/><stop offset=".62" stopColor="#44D6C3"/><stop offset="1" stopColor="#227DA9"/></linearGradient>
        <linearGradient id="field-ribbon-b" x1="600" y1="80" x2="100" y2="650" gradientUnits="userSpaceOnUse"><stop stopColor="#54E7D3"/><stop offset=".48" stopColor="#3A9FD0"/><stop offset=".8" stopColor="#B5C978"/><stop offset="1" stopColor="#F8AE64"/></linearGradient>
        <filter id="field-soft"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="field-light"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>
      <circle cx="360" cy="355" r="340" fill="url(#field-glow)"/>
      <g className="living-core__flow" strokeLinecap="round">
        <path d="M85 458 C20 305 152 87 357 86 C594 80 680 284 590 445 C499 603 284 632 194 494 C108 362 240 209 380 222 C500 233 553 365 468 453 C399 522 292 493 276 414 C260 344 318 293 378 313 C422 328 429 371 404 394" stroke="url(#field-ribbon-a)" strokeWidth="54" opacity=".22" filter="url(#field-soft)"/>
        <path d="M83 452 C25 305 160 91 359 91 C592 90 679 290 582 444 C486 601 285 621 199 490 C112 358 238 207 379 222 C502 235 548 363 468 450 C398 521 293 492 278 414 C261 347 317 295 376 313 C421 326 431 370 402 392" stroke="url(#field-ribbon-a)" strokeWidth="13" opacity=".95"/>
        <path d="M593 208 C660 358 542 574 356 605 C150 640 40 481 123 307 C206 134 435 115 523 256 C604 384 481 525 354 499 C239 475 209 343 289 276 C361 216 458 254 464 332 C471 393 408 436 358 403 C325 383 323 352 348 336" stroke="url(#field-ribbon-b)" strokeWidth="45" opacity=".18" filter="url(#field-soft)"/>
        <path d="M593 208 C660 358 542 574 356 605 C150 640 40 481 123 307 C206 134 435 115 523 256 C604 384 481 525 354 499 C239 475 209 343 289 276 C361 216 458 254 464 332 C471 393 408 436 358 403 C325 383 323 352 348 336" stroke="url(#field-ribbon-b)" strokeWidth="8" opacity=".95"/>
        <path d="M138 161 C279 30 520 66 627 238" stroke="#EFC58B" strokeWidth="3" opacity=".6"/>
        <path d="M97 557 C234 683 471 679 614 536" stroke="#6BE2D0" strokeWidth="3" opacity=".55"/>
      </g>
      <g filter="url(#field-light)" fill="#FCE4B7"><circle cx="354" cy="356" r="22" opacity=".9"/><circle cx="355" cy="356" r="39" opacity=".22"/></g>
      <circle cx="354" cy="356" r="11" fill="#FFF3D7"/>
      <g fill="#F7C589"><circle cx="586" cy="445" r="5"/><circle cx="139" cy="160" r="4"/></g>
      <g fill="#7BE4D5"><circle cx="122" cy="308" r="6"/><circle cx="615" cy="534" r="4"/></g>
    </svg>
  </div>;
}
