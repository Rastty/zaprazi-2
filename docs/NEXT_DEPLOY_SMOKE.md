# Next Deploy Smoke — ZaPrazi 2.0 v0.8.13

Run after deploying release 0.8.13 from `dev`.

## 1. Release integrity

Open `/`.

Expected:
- `zaprazi-release` = `0.8.13`,
- `zaprazi-integrity` = `ok`,
- homepage, `/koupelna-a-wc/` and the new reimbursement page load without errors.

## 2. New Bathroom/WC reimbursement resource

Open:
`/pomucky-do-koupelny-na-pojistovnu/`

Expected:
- normal published WordPress page,
- H1: Pomůcky do koupelny a na WC na pojišťovnu v roce 2026,
- visible VZP evidence date 29. 9. 2026,
- prior insurer approval is explained,
- group examples include shower/bath seats, shower chairs, shower wheelchairs, toilet chairs and toilet wheelchairs,
- 1 piece / 10 years is presented only as the current VZP rule for the described group,
- practical doctor is listed among VZP-described prescriber specialties,
- SÚKL monthly-list freshness is explained.

Must NOT claim:
- UNIZDRAV P2868 is reimbursed,
- UNIZDRAV P2131 is reimbursed,
- any individual qualifies automatically.

## 3. FAQ + schema parity

Visible FAQ must contain:
- Hradí pojišťovna sprchovací nebo toaletní židli?
- Mohu si koupit pomůcku a potom požádat pojišťovnu o proplacení?
- Může pomůcku do koupelny předepsat praktický lékař?
- Je nástavec na WC automaticky hrazený?

Expected:
- resource FAQ structured data mirrors the same wording.

## 4. Advisor internal route

Run an eligible Bathroom/WC branch.

Expected under **Prověřit hrazenou alternativu**:
- internal link **Jak funguje úhrada koupelnových pomůcek**,
- separate links to current SÚKL and VZP sources.

## 5. Affiliate regression

Open **Nastavení → ZaPrazi affiliate**.

Expected:
- Mobility remains 3/3,
- Koupelna a WC remains 0/5 until exact UNIZDRAV publisher deeplinks are entered,
- all five Bathroom/WC canonical fallbacks still work,
- affiliate state does not change recommendation order.

## 6. Safety regression

Expected:
- assisted transfer → professional-check only,
- bath transfer → professional-check only,
- combined shower/toilet wheelchair → professional-check only,
- no commercial shortcut on those branches.

## After smoke

Next Slice 2 work:
1. exact UNIZDRAV publisher deeplinks for the 5 production slots,
2. product-level SÚKL mapping only where exact identity can be proven,
3. further SEO/reference pages only after useful query evidence or a clear high-intent gap.

Search Console remains the trigger for switching to track 2.
