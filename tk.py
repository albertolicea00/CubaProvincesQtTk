"""Public widget helper: two linked province/municipality comboboxes (Tkinter).

``CubaProvinces_BoxGroup`` fills a province ``ttk.Combobox`` and, when a
municipality box is also provided, keeps it in sync with the selected
province. It can either drive comboboxes you already created or build them
itself from a parent widget.

This is the Tkinter port of ``qt.py`` (which uses PyQt5); the public API is
the same: ``exec()`` / ``exec_()`` and the ``selected`` property.
"""
from tkinter import ttk

from base.main import *


class CubaProvinces_BoxGroup():
    """Link a province combobox to a municipality combobox.

    Args:
        provinceBox: Existing province ``ttk.Combobox`` (caller-managed mode).
        municipalityBox: Existing municipality ``ttk.Combobox`` (caller-managed mode).
        parent: Parent widget. If given, both comboboxes are created and
            positioned by this group instead of being passed in.
        allignment: ``"row"`` (stacked) or ``"column"`` (side by side).
            Only used when ``parent`` is provided.
    """

    def __init__(self, provinceBox=None, municipalityBox=None, parent=None, allignment="row"):
        self.__repository = Provinces_Municipaly()

        # Per-province municipality lists, ordered to match the province
        # combobox (same order as repository.provinces and the __linkTogether
        # index). Used to resolve a municipality back to its province.
        self.__municipalityByIndex = [
            self.__repository.IsladelaJuventud,
            self.__repository.PinardelRio,
            self.__repository.Artemisa,
            self.__repository.LaHabana,
            self.__repository.Mayabeque,
            self.__repository.Matanzas,
            self.__repository.Cienfuegos,
            self.__repository.VillaClara,
            self.__repository.SanctiSpiritus,
            self.__repository.CiegodeAvila,
            self.__repository.Camaguey,
            self.__repository.LasTunas,
            self.__repository.Granma,
            self.__repository.Holguin,
            self.__repository.SantiagodeCuba,
            self.__repository.Guantanamo,
        ]

        self.__provinceBox = provinceBox
        self.__municipalityBox = municipalityBox

        self.allignment = allignment.lower()
        self.parent = parent

        self.__validateParent(parent)

    def exec(self):
        """Populate the boxes and wire the province -> municipality link."""
        self.exec_()

    def exec_(self):
        """Populate the boxes and wire the province -> municipality link.

        Behaviour depends on which boxes are set:
          * both boxes  -> fill provinces and link the municipality box.
          * province only -> fill provinces, no link.
          * municipality only -> fill the full flat municipality list.
        """
        if self.__provinceBox is not None and self.__municipalityBox is not None:
            self.__provinceBox["values"] = self.__repository.provinces
            self.__provinceBox.bind("<<ComboboxSelected>>", self.__linkTogether)

        elif self.__provinceBox is not None and self.__municipalityBox is None:
            self.__provinceBox["values"] = self.__repository.provinces

        elif self.__municipalityBox is not None and self.__provinceBox is None:
            self.__municipalityBox["values"] = self.__repository.municipality

    def __validateParent(self, parent):
        """Build the comboboxes when a parent widget is supplied."""
        if parent is not None:
            self.__buildComboBox(parent)

    def __buildComboBox(self, parent):
        """Create and position both comboboxes under ``parent``."""
        # Possibly wrap these in a frame or label-frame later.
        self.__provinceBox = ttk.Combobox(parent)
        self.__municipalityBox = ttk.Combobox(parent)

        if self.allignment == "row":
            self.__provinceBox.place(x=0, y=0, width=200, height=30)
            self.__municipalityBox.place(x=0, y=32, width=200, height=30)
        elif self.allignment == "column":
            self.__provinceBox.place(x=0, y=0, width=200, height=30)
            self.__municipalityBox.place(x=202, y=0, width=200, height=30)

    def __linkTogether(self, event=None):
        """Refill the municipality box for the currently selected province.

        Bound to ``<<ComboboxSelected>>`` so Tkinter passes an event object;
        the selected index is read from the province box itself. ``event`` is
        optional so the ``selected`` setter can call this directly.
        """
        province_opt = self.__provinceBox.current()

        # Clear any previously displayed municipality.
        self.__municipalityBox.set("")

        if province_opt == 0:
            self.__municipalityBox["values"] = self.__repository.IsladelaJuventud

        elif province_opt == 1:
            self.__municipalityBox["values"] = self.__repository.PinardelRio

        elif province_opt == 2:
            self.__municipalityBox["values"] = self.__repository.Artemisa

        elif province_opt == 3:
            self.__municipalityBox["values"] = self.__repository.LaHabana

        elif province_opt == 4:
            self.__municipalityBox["values"] = self.__repository.Mayabeque

        elif province_opt == 5:
            self.__municipalityBox["values"] = self.__repository.Matanzas

        elif province_opt == 6:
            self.__municipalityBox["values"] = self.__repository.Cienfuegos

        elif province_opt == 7:
            self.__municipalityBox["values"] = self.__repository.VillaClara

        elif province_opt == 8:
            self.__municipalityBox["values"] = self.__repository.SanctiSpiritus

        elif province_opt == 9:
            self.__municipalityBox["values"] = self.__repository.CiegodeAvila

        elif province_opt == 10:
            self.__municipalityBox["values"] = self.__repository.Camaguey

        elif province_opt == 11:
            self.__municipalityBox["values"] = self.__repository.LasTunas

        elif province_opt == 12:
            self.__municipalityBox["values"] = self.__repository.Granma

        elif province_opt == 13:
            self.__municipalityBox["values"] = self.__repository.Holguin

        elif province_opt == 14:
            self.__municipalityBox["values"] = self.__repository.SantiagodeCuba

        elif province_opt == 15:
            self.__municipalityBox["values"] = self.__repository.Guantanamo

    @property
    def selected(self):
        """Current selection as a ``(province, municipality)`` tuple.

        Either element is ``None`` when its combobox is absent or empty.
        """
        province = self.__provinceBox.get() if self.__provinceBox is not None else None
        municipality = self.__municipalityBox.get() if self.__municipalityBox is not None else None
        return (province or None, municipality or None)

    @selected.setter
    def selected(self, municipality):
        """Select a municipality by name and draw it directly.

        Resolves the province that owns ``municipality``, selects it in the
        province box (which refills the municipality box), then selects the
        municipality itself. Requires a municipality box.

        Raises:
            RuntimeError: if there is no municipality box to draw into.
            ValueError: if ``municipality`` is not found in any province.
        """
        if self.__municipalityBox is None:
            raise RuntimeError("selected setter requires a municipality box")

        index = self.__provinceIndexForMunicipality(municipality)
        if index is None:
            raise ValueError(f"unknown municipality: {municipality!r}")

        if self.__provinceBox is not None:
            # Select the province, then refill explicitly: setting current()
            # programmatically does not fire <<ComboboxSelected>>.
            self.__provinceBox.current(index)
            self.__linkTogether()
        else:
            self.__municipalityBox["values"] = self.__municipalityByIndex[index]

        self.__municipalityBox.set(municipality)

    def __provinceIndexForMunicipality(self, municipality):
        """Return the province index that contains ``municipality``.

        Returns the first match, or ``None`` if no province lists it.
        """
        for index, municipalities in enumerate(self.__municipalityByIndex):
            if municipality in municipalities:
                return index
        return None
